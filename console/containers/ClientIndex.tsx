import React, { FC, useCallback, useState } from 'react';
import { Flex } from '@rebass/grid';
import { useQuery } from 'react-query';

import { useHistory } from 'react-router';

import { clientAccountsIndex, clientAccountCreate } from '../resources';
import ClientTable from '../components/ClientTable';
import NewClientDialog from '../components/NewClientDialog';
import { LazyContent } from '../components/LazyContent';

const ClientIndex: FC = () => {
  const history = useHistory();
  const [isNewDialogShown, setIsNewDialogShown] = useState(false);
  const { data: clientAccounts } = useQuery('clientAccounts', () => clientAccountsIndex.get({}), {
    refetchInterval: 5000,
  });

  const openNewDialog = useCallback(() => setIsNewDialogShown(true), []);
  const closeNewDialog = useCallback(() => setIsNewDialogShown(false), []);

  const createNewClient = useCallback(
    async (name: string, redshiftUser: string, redshiftPassword: string) => {
      const newClientAccount = { name, redshift_user: redshiftUser, redshift_password: redshiftPassword };
      const clientAccount = await clientAccountCreate.post({}, newClientAccount);
      closeNewDialog();
      const location = { pathname: `/console/clients/${clientAccount.name}` };
      history.push(location);
    },
    [closeNewDialog, history]
  );

  return (
    <Flex flexDirection="column" py={2} mx={'auto'} width={[1, 1, 1, 960]}>
      <h1>Client Accounts</h1>
      <LazyContent content={clientAccounts}>
        {(clientAccounts) => <ClientTable clientAccounts={clientAccounts} onNewClientClick={openNewDialog} />}
      </LazyContent>
      <NewClientDialog isOpen={isNewDialogShown} onClose={closeNewDialog} onCreate={createNewClient} />
    </Flex>
  );
};

export default ClientIndex;
