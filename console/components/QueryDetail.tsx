import React, { memo } from 'react';
import { Flex } from '@rebass/grid';

import { Query } from '../resources';

import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';
import { HTMLTable, Classes } from '@blueprintjs/core';

function fmtDate(strDate: string) {
  const dt = new Date(strDate);
  return dt.toLocaleString();
}

type Props = {
  query: Query;
};

const QueryDetail = memo<Props>(function QueryDetail({ query }) {
  return (
    <Flex flexDirection="column">
      <h1>Query #{query.id}</h1>
      <HTMLTable>
        <thead>
          <tr>
            <th style={{ width: '50%' }}>Attribute</th>
            <th style={{ width: '50%' }}>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ID</td>
            <td>{query.id}</td>
          </tr>
          <tr>
            <td>Client Account</td>
            <td>
              <Link to={`/console/clients/${query.client_account_name}`}>{query.client_account_name}</Link>
            </td>
          </tr>
          <tr>
            <td>Status</td>
            <td>
              <StatusBadge>{query.status}</StatusBadge>
            </td>
          </tr>
          <tr>
            <td>Created at</td>
            <td>{fmtDate(query.created_at)}</td>
          </tr>
          <tr>
            <td>S3 Object</td>
            <td>
              {query.s3_prefix?.replace('/result.csv.', '')}
            </td>
          </tr>
          <tr>
            <td>Manifest File</td>
            <td>
              {query.manifest_file_url === null ? 'Not Exist' : 'Exist'}
            </td>
          </tr>
        </tbody>
      </HTMLTable>
      <Flex flexDirection="column" mt={3}>
        <h2>SQL</h2>
        <pre className={Classes.CODE_BLOCK} style={{ overflow: 'auto' }}>
          {query.select_stmt}
        </pre>
      </Flex>
      {query.error !== null && (
        <Flex flexDirection="column" mt={3}>
          <h2>Error</h2>
          <pre>{query.error}</pre>
        </Flex>
      )}
    </Flex>
  );
});

export default QueryDetail;
