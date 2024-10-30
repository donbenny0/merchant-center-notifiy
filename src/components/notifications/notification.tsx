import { useState, useEffect } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './notifications';
import DataTable from '@commercetools-uikit/data-table';
import DataTableManager from '@commercetools-uikit/data-table-manager';
import TextInput from '@commercetools-uikit/text-input';
import { Pagination } from '@commercetools-uikit/pagination';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { EditIcon } from '@commercetools-uikit/icons';
import SelectField from '@commercetools-uikit/select-field';
import style from './notifications.module.css';
import { useAsyncDispatch, actions } from '@commercetools-frontend/sdk';
import { MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';

// ... (previous interfaces remain the same)
interface NotificationValue {
  channel: string;
  status: string;
  logs: any[];
  resourceType: string;
  recipient: string;
}

interface NotificationResult {
  id: string;
  version: number;
  versionModifiedAt: string;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: {
    clientId: string;
    isPlatformClient: boolean;
  };
  createdBy: {
    clientId: string;
    isPlatformClient: boolean;
  };
  container: string;
  key: string;
  value: NotificationValue;
}

interface ApiResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: NotificationResult[];
}

const Notifications = () => {
  const dispatch = useAsyncDispatch();
  const [notifications, setNotifications] = useState<NotificationResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filterField, setFilterField] = useState('all');
  const [filterValue, setFilterValue] = useState('');

  // ... (fetchCustomObjects useEffect remains the same)
  useEffect(() => {
    async function fetchCustomObjects() {
      try {
        const result = await dispatch(
          actions.get({
            mcApiProxyTarget: MC_API_PROXY_TARGETS.COMMERCETOOLS_PLATFORM,
            service: 'customObjects',
            options: {
              id: 'notifications',
            },
          })
        ) as ApiResponse;

        setNotifications(result.results);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching custom objects:', error);
        setIsLoading(false);
      }
    }

    fetchCustomObjects();
  }, [dispatch]);

  const columns = [
    { key: 'resourceType', label: 'Resource Type' },
    { key: 'recipient', label: 'Send To' },
    { key: 'channel', label: 'Channel' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Notified On' },
  ];

  const filterOptions = [
    { value: 'all', label: 'All Fields' },
    { value: 'resourceType', label: 'Resource Type' },
    { value: 'recipient', label: 'Send To' },
    { value: 'channel', label: 'Channel' },
    { value: 'status', label: 'Status' },
  ];

  const rows = notifications.map(notification => ({
    id: notification.id,
    resourceType: notification.value.resourceType,
    recipient: notification.value.recipient,
    channel: notification.value.channel,
    status: notification.value.status,
    createdAt: new Date(notification.createdAt).toLocaleDateString(),
  }));

  // Updated filtering logic
  const filteredRows = rows.filter(row => {
    const searchTermLower = searchTerm.toLowerCase();
    const filterValueLower = filterValue.toLowerCase();

    if (filterField === 'all') {
      return Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTermLower)
      );
    }

    return String(row[filterField as keyof typeof row])
      .toLowerCase()
      .includes(filterValueLower);
  });

  const paginatedRows = filteredRows.slice((page - 1) * perPage, page * perPage);

  return (
    <Spacings.Stack scale="xl">
      <div className={style.headerTile}>
        <Text.Headline as="h2" intlMessage={messages.title} />
        <SecondaryButton
          iconLeft={<EditIcon />}
          label="Edit message"
          onClick={() => alert('Button clicked')}
        />
      </div>
      <Text.Subheadline as='h5' intlMessage={messages.subtitle} />

      <Spacings.Inline scale="m" alignItems="center">
        <div style={{ flex: 1 }}>
          <TextInput
            value={filterField === 'all' ? searchTerm : filterValue}
            onChange={event =>
              filterField === 'all'
                ? setSearchTerm(event.target.value)
                : setFilterValue(event.target.value)
            }
            placeholder={`Search${filterField !== 'all' ? ` by ${filterOptions.find(opt => opt.value === filterField)?.label}` : '...'}`}
          />
        </div>
        <div style={{ width: '200px' }}>
          <SelectField
            horizontalConstraint="scale"
            name="filter"
            title=""
            value={filterField}
            options={filterOptions}
            onChange={(event) => {
              setFilterField(event.target.value as string);
              setFilterValue('');
              setSearchTerm('');
            }}
            touched={true}
            errors={{}}
            isRequired={false}
          />
        </div>
      </Spacings.Inline>

      {isLoading ? (
        <Text.Body>Loading...</Text.Body>
      ) : (
        <>
          <DataTableManager columns={columns}>
            <DataTable
              maxHeight="350px"
              rows={paginatedRows}
              columns={columns}
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
    </Spacings.Stack>
  );
};

export default Notifications;