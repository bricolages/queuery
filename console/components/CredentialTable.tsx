import React, { memo } from 'react';
import { Button, Menu, MenuItem, Tag, Intent, Popover, Position, HTMLTable } from '@blueprintjs/core';

import { ClientCredential } from '../resources';

type Props = {
  credentials: ClientCredential[];
  onNewCredentialClick: () => void;
  onDisableCredentialClick: (token: string) => void;
  onEnableCredentialClick: (token: string) => void;
};

const ClientCredentialTable = memo<Props>(function ClientCredentialTable({
  credentials,
  onNewCredentialClick,
  onDisableCredentialClick,
  onEnableCredentialClick,
}) {
  const dropdownMenu = (token: string, disabled: boolean) => (
    <Menu>
      <MenuItem icon="endorsed" text="Enable" disabled={!disabled} onClick={() => onEnableCredentialClick(token)} />
      <MenuItem icon="disable" text="Disable" disabled={disabled} onClick={() => onDisableCredentialClick(token)} />
    </Menu>
  );
  return (
    <HTMLTable striped style={{ width: '100%' }}>
      <thead>
        <tr>
          <th style={{ width: '100%' }}>token</th>
          <th style={{ width: '0.1%' }}>status</th>
          <th style={{ width: '0.1%', textAlign: 'right' }}>
            <Button className="bp3-minimal" onClick={() => onNewCredentialClick()} icon="plus" />
          </th>
        </tr>
      </thead>
      <tbody>
        {credentials.map(({ token, disabled }) => (
          <tr key={token}>
            <td>{token}</td>
            <td>
              {disabled && <Tag intent={Intent.NONE}>disabled</Tag>}
              {!disabled && <Tag intent={Intent.PRIMARY}>enabled</Tag>}
            </td>
            <td>
              <Popover position={Position.BOTTOM_RIGHT} content={dropdownMenu(token, disabled)}>
                <Button className="bp3-minimal" icon="more" />
              </Popover>
            </td>
          </tr>
        ))}
      </tbody>
    </HTMLTable>
  );
});

export default ClientCredentialTable;
