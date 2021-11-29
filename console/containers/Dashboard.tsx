import * as React from "react";
import { Flex } from '@rebass/grid';

import GlobalQueryIndex from "../components/GlobalQueryIndex";

const Dashboard = () => {
  return (
    <Flex width={[1, 1, 1, 960]} mx={'auto'} py={2} flexDirection="column">
      <h1>Dashboard</h1>
      <GlobalQueryIndex />
    </Flex>
  );
};

export default Dashboard;
