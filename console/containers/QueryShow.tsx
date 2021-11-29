import React, { FC } from 'react';

import { useRouteMatch } from 'react-router';

import { queryShow } from '../resources';

import QueryDetail from '../components/QueryDetail';
import { Flex } from '@rebass/grid';
import { useQuery } from 'react-query';
import { LazyContent } from '../components/LazyContent';

type Params = {
  id: string;
};

const QueryShow: FC = () => {
  const { id } = useRouteMatch<Params>().params;
  const { data: query } = useQuery(['query', id], () => queryShow.get({ id }), { refetchInterval: 5000 });

  return (
    <Flex flexDirection="column" py={2} mx={'auto'} width={[1, 1, 1, 960]}>
      <LazyContent content={query}>{(query) => <QueryDetail query={query} />}</LazyContent>
    </Flex>
  );
};

export default QueryShow;
