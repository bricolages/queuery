import React, { FC, useCallback, useState } from 'react';
import { Flex } from '@rebass/grid';
import { useQuery } from 'react-query';

import { clientCredentialsIndex, clientCredentialUpdate, clientCredentialCreate, ClientAccount } from '../resources';
import CredentialTable from '../components/CredentialTable';
import NewCredentialDialog from '../components/NewCredentialDialog';
import { LazyContent } from '../components/LazyContent';

type Props = {
  name: string;
  clientAccount: ClientAccount;
};

const ClientCredentialIndex: FC<Props> = (props) => {
  const { name, clientAccount } = props;
  const [isNewDialogShown, setIsNewDialogShown] = useState(false);
  const { data: credentials, refetch } = useQuery(['credentials', name], () => clientCredentialsIndex.get({ name }), {
    refetchInterval: 5000,
  });

  const openNewDialog = useCallback(() => setIsNewDialogShown(true), []);
  const closeNewDialog = useCallback(() => setIsNewDialogShown(false), []);

  const createNewCredential = useCallback(
    (clientAccount: ClientAccount) => clientCredentialCreate.post({ name }, clientAccount),
    [name]
  );

  const disableCredential = useCallback(
    async (token: string) => {
      await clientCredentialUpdate.put({ token }, { disabled: true });
      refetch();
    },
    [refetch]
  );

  const enableCredential = useCallback(
    async (token: string) => {
      await clientCredentialUpdate.put({ token }, { disabled: false });
      refetch();
    },
    [refetch]
  );

  return (
    <Flex flexDirection="column">
      <h2>Client Credentials</h2>
      <LazyContent content={credentials}>
        {(credentials) => (
          <CredentialTable
            credentials={credentials}
            onNewCredentialClick={openNewDialog}
            onDisableCredentialClick={disableCredential}
            onEnableCredentialClick={enableCredential}
          />
        )}
      </LazyContent>
      <NewCredentialDialog
        clientAccount={clientAccount}
        isOpen={isNewDialogShown}
        onClose={closeNewDialog}
        onCreate={createNewCredential}
      />
    </Flex>
  );
};

export default ClientCredentialIndex;
