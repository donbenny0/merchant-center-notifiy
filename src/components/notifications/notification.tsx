import { useState, useEffect, useCallback, useMemo } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './messages';
import DataTable from '@commercetools-uikit/data-table';
import DataTableManager from '@commercetools-uikit/data-table-manager';
import TextInput from '@commercetools-uikit/text-input';
import { Pagination } from '@commercetools-uikit/pagination';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { EditIcon, ExportIcon } from '@commercetools-uikit/icons';
import SelectField from '@commercetools-uikit/select-field';
import DateInput from '@commercetools-uikit/date-input';
import style from './notifications.module.css';
import { useAsyncDispatch } from '@commercetools-frontend/sdk';
import Link from '@commercetools-uikit/link';
import { useRouteMatch } from 'react-router-dom';
import { NotificationResult } from '../../interfaces/notifications.interface';
import { fetchAllNotificationsObject } from '../../hooks/notifications.hook';
import { filterRows, toSentenceCase } from '../../utils/notifications.utils';
import noDataImg from './nodata.png'
import Loader from '../loader';
import * as XLSX from 'xlsx';

const ITEMS_PER_PAGE = 10;

const columns = [
  { key: 'resourceType', label: 'Resource Type', isSortable: true },
  { key: 'recipient', label: 'Recipient', isSortable: true },
  { key: 'channel', label: 'Channel', isSortable: true },
  { key: 'status', label: 'Status', isSortable: true },
  { key: 'createdAt', label: 'Notified On', isSortable: true },
];

const filterOptions = [
  { value: 'all', label: 'All Fields' },
  { value: 'resourceType', label: 'Resource Type' },
  { value: 'recipient', label: 'Recipient' },
  { value: 'channel', label: 'Channel' },
  { value: 'status', label: 'Status' },
  { value: 'date', label: 'Date' },
];

const Notifications = () => {
  const dispatch = useAsyncDispatch();
  const match = useRouteMatch();
  const [notifications, setNotifications] = useState<NotificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(ITEMS_PER_PAGE);
  const [filterField, setFilterField] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<{ key: string; order: 'asc' | 'desc' }>({
    key: 'createdAt',
    order: 'desc'
  });

  const loadNotifications = useCallback(async () => {
    try {
      const results = await fetchAllNotificationsObject(dispatch);
      setNotifications(results);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);

    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const rows = useMemo(() => notifications.map(notification => ({
    id: notification.id,
    resourceType: toSentenceCase(notification.value.resourceType),
    recipient: notification.value.recipient,
    channel: toSentenceCase(notification.value.channel),
    status: toSentenceCase(notification.value.status),
    createdAt: new Date(notification.createdAt).toLocaleDateString(),
  })), [notifications]);

  const filteredRows = useMemo(() => {
    let filtered = filterRows(rows, searchTerm, filterValue, filterField);

    if (dateFilter && filterField === 'date') {
      filtered = filtered.filter(row => row.createdAt === new Date(dateFilter).toLocaleDateString());
    }

    return filtered;
  }, [rows, searchTerm, filterValue, filterField, dateFilter]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const aValue = a[sortBy.key as keyof typeof a];
      const bValue = b[sortBy.key as keyof typeof b];

      if (sortBy.order === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [filteredRows, sortBy]);

  const paginatedRows = useMemo(() =>
    sortedRows.slice((page - 1) * perPage, page * perPage),
    [sortedRows, page, perPage]
  );

  const handleFilterChange = useCallback((event: { target: { value: string } }) => {
    setFilterField(event.target.value);
    setFilterValue('');
    setSearchTerm('');
    setDateFilter('');
  }, []);

  const handleSearchChange = useCallback((event: { target: { value: string } }) => {
    filterField === 'all'
      ? setSearchTerm(event.target.value)
      : setFilterValue(event.target.value);
  }, [filterField]);

  const handleDateChange = useCallback((event: { target: { value: string } }) => {
    setDateFilter(event.target.value);
  }, []);

  const handleColumnSort = useCallback((columnKey: string) => {
    setSortBy(prevSort => ({
      key: columnKey,
      order: prevSort.key === columnKey && prevSort.order === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const handleExport = useCallback(() => {
    const worksheet = XLSX.utils.json_to_sheet(sortedRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Notifications");
    XLSX.writeFile(workbook, "notifications.xlsx");
  }, [sortedRows]);

  const searchPlaceholder = useMemo(() =>
    `Search${filterField !== 'all' ? ` by ${filterOptions.find(opt => opt.value === filterField)?.label}` : '...'}`,
    [filterField]
  );

  return (
    <Spacings.Stack scale="xl">
      <div className={style.headerTile}>
        <Text.Headline as="h1" intlMessage={messages.title} />
        <div className={style.actionButtons}>
          <Link isExternal={false} to={`${match.url}/edit-message`}>
            <SecondaryButton
              iconLeft={<EditIcon />}
              label="Edit message"
            />
          </Link>
          {paginatedRows.length === 0 ? (<></>) : (<><SecondaryButton
            iconLeft={<ExportIcon />}
            label="Export"
            onClick={handleExport}
          /></>)}

        </div>

      </div>
      <Text.Subheadline as='h5' intlMessage={messages.subtitle} />
      <>
        {isLoading ? (
          <div className={style.loadingContainer}>
            <Loader />
          </div>
        ) : paginatedRows.length === 0 ? (
          <div className={style.noDataFoudContainer}>
            <img className={style.noDataImg} src={noDataImg} alt="" />
            <span>Looks like my notification inbox is as empty as my fridge after midnight!</span>
          </div>
        ) : (
          <>
            <Spacings.Inline scale="m" alignItems="center">
              <div style={{ flex: 1 }}>
                {filterField === 'date' ? (
                  <DateInput
                    value={dateFilter}
                    onChange={(event) => handleDateChange({ target: { value: event.target.value || '' } })}
                    horizontalConstraint="scale"
                  />
                ) : (
                  <TextInput
                    value={filterField === 'all' ? searchTerm : filterValue}
                    onChange={handleSearchChange}
                    placeholder={searchPlaceholder}
                  />
                )}
              </div>
              <div style={{ width: '200px' }}>
                <SelectField
                  horizontalConstraint="scale"
                  name="filter"
                  title=""
                  value={filterField}
                  options={filterOptions}
                  onChange={(event) => handleFilterChange({ target: { value: event.target.value as string } })}
                  touched={true}
                  errors={{}}
                  isRequired={false}
                />
              </div>
            </Spacings.Inline>

            <DataTableManager columns={columns}>
              <DataTable
                maxHeight="350px"
                rows={paginatedRows}
                columns={columns}
                sortedBy={sortBy.key}
                sortDirection={sortBy.order}
                onSortChange={handleColumnSort}
                onRowClick={(row) => {
                  window.history.pushState({}, '', `${match.url}/logs/${row.id}`);
                  window.dispatchEvent(new PopStateEvent('popstate'));
                }}
              />
            </DataTableManager>

            <Pagination
              page={page}
              onPageChange={setPage}
              perPage={perPage}
              onPerPageChange={setPerPage}
              totalItems={filteredRows.length}
            />
          </>
        )}
      </>    </Spacings.Stack>
  );
};

export default Notifications;
