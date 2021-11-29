import * as React from "react";
import { Button, Intent, HTMLTable } from '@blueprintjs/core';

type Props = {
  redshiftUser: string,
  onClick: () => void
}

const RedshiftAccess = (props: Props) => {
    const redshiftUser = props.redshiftUser;
    return (
      <HTMLTable striped style={{ width: '100%'}}>
        <thead>
          <tr>
            <th style={{ width: '90%'}}>user name</th>
            <th style={{ width: '10%'}}></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              {redshiftUser}
            </td>
            <td>
              <Button className="bp3" style={{ width: '100%', marginLeft: 'auto' }} intent={Intent.PRIMARY} text="Edit" onClick={props.onClick} icon="edit" />
            </td>
          </tr>
        </tbody>
      </HTMLTable>
    );
}

export default RedshiftAccess;