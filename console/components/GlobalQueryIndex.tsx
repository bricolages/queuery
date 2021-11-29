import * as React from 'react';
import { useQuery } from 'react-query';
import { globalQueriesIndex } from '../resources';
import GlobalQueryTable from './GlobalQueryTable';
import { LazyContent } from './LazyContent';

const GlobalQueryIndex: React.FC = () => {
  const { data } = useQuery('globalQueries', () => globalQueriesIndex.get({}), { refetchInterval: 5000 });

  return <LazyContent content={data}>{(queries) => <GlobalQueryTable queries={queries} />}</LazyContent>;
};

export default GlobalQueryIndex;
