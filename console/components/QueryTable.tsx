import React, { memo } from 'react';
import { Classes, HTMLTable } from '@blueprintjs/core';

import { Query } from '../resources';

import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';
import { iconClass } from '@blueprintjs/core/lib/esm/common/classes';
import { IconNames } from '@blueprintjs/icons';

function fmtDate(strDate: string) {
  const dt = new Date(strDate);
  return dt.toLocaleString();
}

type Props = {
  queries: Query[];
};

const QueryTable = memo<Props>(function QueryTable({ queries }) {
  return (
    <HTMLTable striped style={{ width: '100%' }}>
      <thead>
        <tr>
          <th className="text-right">ID</th>
          <th>Status</th>
          <th>Timestamp</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {queries.map((query) => (
          <tr key={query.id}>
            <td className="text-right">{query.id}</td>
            <td>
              <StatusBadge>{query.status}</StatusBadge>
            </td>
            <td>{fmtDate(query.created_at)}</td>
            <td className="text-right">
              <Link
                to={`/console/clients/${query.client_account_name}/queries/${query.id}`}
                className={[Classes.BUTTON, Classes.MINIMAL, iconClass(IconNames.CHEVRON_RIGHT)].join(' ')}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
});

export default QueryTable;
