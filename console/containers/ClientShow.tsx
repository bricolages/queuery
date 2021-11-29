import React, { FC, useCallback, useState } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { Flex, Box } from '@rebass/grid';
import { useQuery } from 'react-query';

import { useHistory, useRouteMatch } from 'react-router';

import { clientAccountDelete, clientAccountShow, clientAccountUpdate } from '../resources';

import QueryIndex from '../components/QueryIndex';
import ClientCredentialIndex from './CredentialIndex';
import DeleteAccountDialog from '../components/DeleteAccountDialog';
import EditRedshiftUserDialog from '../components/EditRedshiftUserDialog';
import RedshiftAccess from '../components/RedshiftAccess';

type Params = {
  name: string;
};

const ClientShow: FC = () => {
  const history = useHistory();
  const { name } = useRouteMatch<Params>().params;
  const [isDeleteDialogShown, setIsDeleteDialogShown] = useState(false);
  const [isEditRedshiftUserDialogShown, setIsEditRedshiftUserDialogShown] = useState(false);
  const { data: clientAccount, refetch } = useQuery(['clientAccount', name], () => clientAccountShow.get({ name }), {
    refetchInterval: 5000,
  });

  const openDeleteDialog = useCallback(() => setIsDeleteDialogShown(true), []);
  const closeDeleteDialog = useCallback(() => setIsDeleteDialogShown(false), []);
  const openEditRedshiftUserDialog = useCallback(() => setIsEditRedshiftUserDialogShown(true), []);
  const closeEditRedshiftUserDialog = useCallback(() => setIsEditRedshiftUserDialogShown(false), []);

  const deleteAccount = useCallback(async () => {
    await clientAccountDelete.delete({ name });
    closeDeleteDialog();
    history.push('/console/clients');
  }, [closeDeleteDialog, history, name]);

  const updateRedshiftUser = useCallback(
    async (user: string, password: string) => {
      const newClientAccount = { name, redshift_user: user, redshift_password: password };
      await clientAccountUpdate.put({ name }, newClientAccount);
      closeEditRedshiftUserDialog();
      refetch();
    },
    [closeEditRedshiftUserDialog, name, refetch]
  );

  return (
    <Flex flexDirection="column" width={[1, 1, 1, 960]} py={2} mx={'auto'}>
      <h1>{name}</h1>
      <Button
        className="bp3"
        style={{ width: '15%', marginLeft: 'auto' }}
        intent={Intent.DANGER}
        text="Delete Client"
        onClick={openDeleteDialog}
        icon="minus"
      />

      <Box mt={3}>
        <h2>Redshift Access</h2>
        {clientAccount ? (
          <>
            <RedshiftAccess redshiftUser={clientAccount.redshift_user} onClick={openEditRedshiftUserDialog} />
            <ClientCredentialIndex name={name} clientAccount={clientAccount} />
          </>
        ) : (
          <div>Loading...</div>
        )}

        <h2>Queries</h2>
        <QueryIndex name={name} />
      </Box>

      <DeleteAccountDialog
        name={name}
        isOpen={isDeleteDialogShown}
        onClose={closeDeleteDialog}
        onDelete={deleteAccount}
      />
      <EditRedshiftUserDialog
        name={name}
        isOpen={isEditRedshiftUserDialogShown}
        onClose={closeEditRedshiftUserDialog}
        onEdit={updateRedshiftUser}
      />
    </Flex>
  );
};

export default ClientShow;
