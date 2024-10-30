import { useState } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import messages from './notifications';
import DataTable from '@commercetools-uikit/data-table';
import DataTableManager from '@commercetools-uikit/data-table-manager';
import TextInput from '@commercetools-uikit/text-input';
import { Pagination } from '@commercetools-uikit/pagination';

const Notifications = () => {
  // Generate dummy data using a loop
  const generateDummyData = (count: number) => {
    const dummyData = [];
    const channels = ['Email', 'SMS', 'Push Notification', 'WhatsApp', 'Slack'];
    const statuses = ['Sent', 'Pending', 'Failed', 'Delivered', 'Read'];

    for (let i = 1; i <= count; i++) {
      const randomChannel = channels[Math.floor(Math.random() * channels.length)];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

      // Generate a random date within the last 30 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      const formattedDate = date.toISOString().split('T')[0];

      dummyData.push({
        id: i.toString(),
        resource: `Resource ${i}`,
        to: `user${i}@example.com`,
        channel: randomChannel,
        status: randomStatus,
        notifiedOn: formattedDate,
      });
    }
    return dummyData;
  };

  // Generate 50 dummy records
  const rows = generateDummyData(50);

  // Define the columns for the data table
  const columns = [
    { key: 'resource', label: 'Resource Type' },
    { key: 'to', label: 'Send To' },
    { key: 'channel', label: 'Channel' },
    { key: 'status', label: 'Status' },
    { key: 'notifiedOn', label: 'Notified On' },
  ];

  // State for the search input
  const [searchTerm, setSearchTerm] = useState('');

  // State for pagination
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10); // Show 10 items per page

  // Filter rows based on the search term
  const filteredRows = rows.filter(row => {
    return (
      row.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.channel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.notifiedOn.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate pagination values
  const totalItems = filteredRows.length;
  const paginatedRows = filteredRows.slice((page - 1) * perPage, page * perPage);

  return (
    <Spacings.Stack scale="xl">
      <Text.Headline as="h2" intlMessage={messages.title} />
      <Text.Subheadline as='h5' intlMessage={messages.subtitle} />

      {/* Search Input */}
      <TextInput
        value={searchTerm}
        onChange={event => setSearchTerm(event.target.value)}
        placeholder="Search..."
      />

      <DataTableManager columns={columns}>
        <DataTable
        maxHeight={"350px"}
          rows={paginatedRows}
          columns={columns}
        />
      </DataTableManager>

      <Pagination
        page={page}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={setPerPage}
        totalItems={totalItems}
      />
    </Spacings.Stack>
  );
};

export default Notifications;