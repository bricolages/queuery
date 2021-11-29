import * as React from 'react';
import { useQuery } from 'react-query';
import { queriesIndex } from '../resources';
import { LazyContent } from './LazyContent';
import QueryTable from './QueryTable';

type Props = {
  name: string;
};

const QueryIndex: React.FC<Props> = ({ name }) => {
  const { data } = useQuery(['queries', name], () => queriesIndex.get({ name }), { refetchInterval: 5000 });

  return <LazyContent content={data}>{(queries) => <QueryTable queries={queries} />}</LazyContent>;
};

export default QueryIndex;
