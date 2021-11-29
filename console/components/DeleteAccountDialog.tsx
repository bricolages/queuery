import * as React from 'react';
import { Button, Dialog, Classes, Intent, Callout } from '@blueprintjs/core';

export default class DeleteAccountDialog extends React.Component<{
  name: string;
  isOpen: Dialog['props']['isOpen'];
  onClose: Dialog['props']['onClose'];
  onDelete: () => Promise<void>;
}> {
  public state = {
    isSubmitting: false,
  };

  handleSubmit() {
    const { onDelete } = this.props;
    this.setState({ isSubmitting: true });
    onDelete().catch(() => {
      this.setState({ isSubmitting: false });
    });
  }

  render() {
    const { name, isOpen, onClose } = this.props;
    const { isSubmitting } = this.state;
    return (
      <Dialog isOpen={isOpen} onClose={onClose} icon="tick" title="Delete Client">
        <div className={Classes.DIALOG_BODY}>
          <b>Client Name:</b> {name}
          <br />
          <br />
          <Callout intent={Intent.DANGER}>
            <b> This action cannot undo.</b> If you notice mistake after delete, regenerate client same client name and
            new tokens.
          </Callout>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button
              loading={isSubmitting}
              intent={Intent.DANGER}
              onClick={this.handleSubmit.bind(this)}
              text="Delete"
            />
          </div>
        </div>
      </Dialog>
    );
  }
}
