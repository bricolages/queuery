import * as React from 'react';
import { Button, Dialog, Classes, Intent, Callout } from '@blueprintjs/core';

export default class EditRedshiftUserDialog extends React.Component<{
  name: string;
  isOpen: Dialog['props']['isOpen'];
  onClose: Dialog['props']['onClose'];
  onEdit: (redshiftUser: string, redshiftPassword: string) => Promise<void>;
}> {
  public state = {
    redshiftUser: '',
    redshiftPassword: '',
    isSubmitting: false,
    postError: false,
  };

  handleRedshiftUserChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const redshiftUser = e.currentTarget.value;
    this.setState({ redshiftUser });
  };

  handlePasswordChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const redshiftPassword = e.currentTarget.value;
    this.setState({ redshiftPassword });
  };

  handleSubmit = () => {
    const { redshiftUser, redshiftPassword } = this.state;
    const { onEdit } = this.props;
    this.setState({ isSubmitting: true });
    onEdit(redshiftUser, redshiftPassword)
      .then(() => {
        const initialState = {
          redshiftUser: '',
          redshiftPassword: '',
          isSubmitting: false,
          postError: false,
        };
        this.setState(initialState);
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isSubmitting: false, postError: true });
      });
  };

  render() {
    const { name, isOpen, onClose } = this.props;
    const { redshiftUser, redshiftPassword, isSubmitting, postError } = this.state;
    return (
      <Dialog isOpen={isOpen} onClose={onClose} icon="tick" title="Edit Redshift User">
        <div className={Classes.DIALOG_BODY}>
          <p>
            <b>Client Name: </b>
          </p>
          <p>{name}</p>

          <label className="bp3-label">
            <b>Redshift User Name</b>
            <input
              type="text"
              className={`bp3-input bp3-fill ${postError ? 'bp3-intent-danger' : ''}`}
              placeholder="user name"
              readOnly={false}
              value={redshiftUser}
              onChange={this.handleRedshiftUserChange}
            />
          </label>

          <label className="bp3-label">
            <b>Redshift Password</b>
            <input
              type="password"
              className={`bp3-input bp3-fill ${postError ? 'bp3-intent-danger' : ''}`}
              placeholder="password"
              readOnly={false}
              value={redshiftPassword}
              onChange={this.handlePasswordChange}
            />
          </label>

          {postError && <Callout intent={Intent.DANGER}>Failed. Please check Redshift User Name and Password.</Callout>}
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button loading={isSubmitting} intent={Intent.PRIMARY} onClick={this.handleSubmit.bind(this)} text="Edit" />
          </div>
        </div>
      </Dialog>
    );
  }
}
