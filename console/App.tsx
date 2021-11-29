import React, { FC, useCallback, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Navbar from './components/Navbar';
import { Switch } from 'react-router';
import ClientShow from './containers/ClientShow';
import Dashboard from './containers/Dashboard';
import QueryShow from './containers/QueryShow';
import ClientIndex from './containers/ClientIndex';

const queryClient = new QueryClient();

const App: FC = () => {
  const [isNightMode, setIsNightMode] = useState<boolean>(() =>
    JSON.parse(localStorage.getItem('isNightMode') || 'false')
  );

  const handleNightModeChange = useCallback((isNightMode: boolean) => {
    localStorage.setItem('isNightMode', JSON.stringify(isNightMode));
    setIsNightMode(isNightMode);
  }, []);

  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <div className={`app-root ${isNightMode ? 'bp3-dark' : ''}`}>
          <Navbar onNightModeChange={handleNightModeChange} isNightMode={isNightMode} />
          <Switch>
            <Route exact path="/console/" component={Dashboard} />
            <Route exact path="/console/clients/" component={ClientIndex} />
            <Route exact path="/console/clients/:name" component={ClientShow} />
            <Route exact path="/console/clients/:name/queries/:id" component={QueryShow} />
            <Route component={() => <p>Not Found</p>} />
          </Switch>
        </div>
      </QueryClientProvider>
    </Router>
  );
};

export default App;
