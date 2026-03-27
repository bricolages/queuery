import React, { memo } from 'react';
import { Button, HTMLTable, Classes, Icon } from '@blueprintjs/core';

import { ClientAccount } from '../resources';

import { Link } from 'react-router-dom';

type Props = {
  clientAccounts: ClientAccount[];
  onNewClientClick: () => void;
};

const ClientTable = memo<Props>(function ClientTable({ clientAccounts, onNewClientClick }) {
  return (
    <HTMLTable striped style={{ width: '100%' }}>
      <thead>
        <tr>
          <th style={{ verticalAlign: 'middle' }}>Client Name</th>
          <th style={{ verticalAlign: 'middle' }}>Redshift User</th>
          <th style={{ textAlign: 'right' }}>
            <Button minimal onClick={() => onNewClientClick()} icon="plus" />
          </th>
        </tr>
      </thead>
      <tbody>
        {clientAccounts.map(({ name, redshift_user: redshiftUser }) => (
          <tr key={name}>
            <td style={{ verticalAlign: 'middle' }}>{name}</td>
            <td style={{ verticalAlign: 'middle' }}>{redshiftUser}</td>
            <td style={{ textAlign: 'right' }}>
              <Link to={{ pathname: `/console/clients/${name}`, state: { redshiftUser } }} className={[Classes.BUTTON, Classes.MINIMAL].join(' ')}>
                <Icon icon="chevron-right" />
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
});

export default ClientTable;
