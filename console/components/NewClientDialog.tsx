import * as React from 'react';
import { Button, Dialog, Classes, Intent, Callout } from '@blueprintjs/core';

export default class NewClientDialog extends React.Component<{
  isOpen: Dialog['props']['isOpen'];
  onClose: Dialog['props']['onClose'];
  onCreate: (name: string, redshiftUser: string, redshiftPassword: string) => Promise<void>;
}> {
  public state = {
    name: '',
    redshiftUser: '',
    redshiftPassword: '',
    isSubmitting: false,
    postError: false,
  };

  isNameValid(): boolean {
    const { name } = this.state;
    return /^[a-z_][a-z_0-9-]*$/i.test(name);
  }

  isSubmitButtonDisabled() {
    const isEnabled = this.isNameValid();
    return !isEnabled;
  }

  handleClientNameChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const name = e.currentTarget.value;
    this.setState({ name });
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
    const { name, redshiftUser, redshiftPassword } = this.state;
    const { onCreate } = this.props;
    this.setState({ isSubmitting: true });
    onCreate(name, redshiftUser, redshiftPassword).catch(() => {
      this.setState({ isSubmitting: false, postError: true });
    });
  };

  render() {
    const { isOpen, onClose } = this.props;
    const { name, redshiftUser, redshiftPassword, isSubmitting, postError } = this.state;
    return (
      <Dialog isOpen={isOpen} onClose={onClose} icon="tick" title="New Client">
        <div className={Classes.DIALOG_BODY}>
          <label className="bp3-label">
            <b>Client Name</b>
            <input
              type="text"
              className={`bp3-input bp3-fill ${this.isNameValid() ? '' : 'bp3-intent-danger'}`}
              placeholder="/^[a-z_][a-z_0-9-]*$/"
              readOnly={false}
              value={name}
              onChange={this.handleClientNameChange}
            />
          </label>

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
            <Button
              disabled={this.isSubmitButtonDisabled()}
              loading={isSubmitting}
              intent={Intent.PRIMARY}
              onClick={this.handleSubmit}
              text="Create"
            />
          </div>
        </div>
      </Dialog>
    );
  }
}
