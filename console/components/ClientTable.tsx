import React, { memo } from 'react';
import { Button, HTMLTable, Classes } from '@blueprintjs/core';

import { ClientAccount } from '../resources';

import { Link } from 'react-router-dom';
import { iconClass } from '@blueprintjs/core/lib/esm/common/classes';
import { IconNames } from '@blueprintjs/icons';

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
            <Button className="bp3-minimal" onClick={() => onNewClientClick()} icon="plus" />
          </th>
        </tr>
      </thead>
      <tbody>
        {clientAccounts.map(({ name, redshift_user: redshiftUser }) => (
          <tr key={name}>
            <td style={{ verticalAlign: 'middle' }}>{name}</td>
            <td style={{ verticalAlign: 'middle' }}>{redshiftUser}</td>
            <td style={{ textAlign: 'right' }}>
              <Link
                to={{ pathname: `/console/clients/${name}`, state: { redshiftUser } }}
                className={[Classes.BUTTON, Classes.MINIMAL, iconClass(IconNames.CHEVRON_RIGHT)].join(' ')}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
});

export default ClientTable;
