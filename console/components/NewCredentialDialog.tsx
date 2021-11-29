import React, { FC, useCallback, useState } from 'react';
import { Button, Dialog, Classes, Intent, HTMLTable, Callout } from '@blueprintjs/core';
import { ClientCredentialWithSecret, ClientAccount } from '../resources';
import { Flex } from '@rebass/grid';

type Props = {
  clientAccount: ClientAccount;
  isOpen: Dialog['props']['isOpen'];
  onClose: () => void;
  onCreate: (submitAccount: ClientAccount) => Promise<ClientCredentialWithSecret>;
};

const NewCredentialDialog: FC<Props> = (props) => {
  const { clientAccount, isOpen, onCreate, onClose } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credential, setCredential] = useState<ClientCredentialWithSecret | null>(null);
  const [postError, setPostError] = useState(false);
  const [redshiftPassword, setRedshiftPassword] = useState('');

  const isSubmitButtonDisabled = credential !== null;

  const handlePasswordChange = useCallback((e: React.SyntheticEvent<HTMLInputElement>) => {
    const inputPassword = e.currentTarget.value;
    setRedshiftPassword(inputPassword);
  }, []);

  const handleSubmit = useCallback(async () => {
    const submitAccount: ClientAccount = { ...clientAccount, redshift_password: redshiftPassword };

    setIsSubmitting(true);
    try {
      const credential = await onCreate(submitAccount);
      setPostError(false);
      setCredential(credential);
    } catch (e) {
      setPostError(true);
      setCredential(null);
    }
    setIsSubmitting(false);
  }, [clientAccount, onCreate, redshiftPassword]);

  const handleClose = useCallback(async () => {
    setCredential(null);
    onClose();
  }, [onClose]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      icon="tick"
      title="New Credential"
      canOutsideClickClose={false}
      canEscapeKeyClose={false}
      style={{ width: 'initial', minWidth: '500px' }}
    >
      <div className={Classes.DIALOG_BODY}>
        <Flex justifyContent="center" flexDirection="column">
          <p>
            <b>Client Name: </b>
          </p>
          <p>{clientAccount.name}</p>
          <p>
            <b>Redshift User Name: </b>
          </p>
          <p>{clientAccount.redshift_user}</p>
          <label className="bp3-label">
            <b>Redshift Password</b>
            <input
              type="password"
              className={`bp3-input bp3-fill ${postError ? 'bp3-intent-danger' : ''}`}
              placeholder="password"
              readOnly={false}
              value={redshiftPassword}
              onChange={handlePasswordChange}
            />
          </label>

          <Button
            className={Classes.LARGE}
            disabled={isSubmitButtonDisabled}
            loading={isSubmitting}
            intent={Intent.PRIMARY}
            onClick={handleSubmit}
            text="Issue New Credential"
            style={{ marginBottom: '15px' }}
          />

          {postError && <Callout intent={Intent.DANGER}>Failed. Please check Redshift User Name and Password.</Callout>}
        </Flex>
        {credential !== null && (
          <HTMLTable>
            <thead>
              <tr>
                <th />
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>token</td>
                <td>
                  <pre>{credential.token}</pre>
                </td>
              </tr>
              <tr>
                <td>token_secret</td>
                <td>
                  <pre>{credential.token_secret}</pre>
                </td>
              </tr>
            </tbody>
          </HTMLTable>
        )}
      </div>
      {credential !== null && (
        <div className={Classes.DIALOG_FOOTER}>
          <div className={`${Classes.CALLOUT} ${Classes.INTENT_DANGER}`}>
            <h5>Save Immediately!</h5>
            You will <strong>NEVER</strong> get this token_secret again!
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default NewCredentialDialog;
