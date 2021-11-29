import React, { FC } from 'react';
import { Button, Classes, Intent, NavbarGroup, Navbar } from '@blueprintjs/core';
import { Link } from 'react-router-dom';
import { Route, useRouteMatch } from 'react-router';
import { IconNames } from '@blueprintjs/icons';
import { iconClass } from '@blueprintjs/core/lib/esm/common/classes';

const TopNav: FC = () => (
  <li>
    <Link to="/console/" className={Classes.BREADCRUMB}>
      Queuery Console
    </Link>
  </li>
);

const ClientAppNav: FC = () => {
  const { name } = useRouteMatch<{ name: string }>().params;
  return (
    <li>
      <Link to={`/console/clients/${name}`} className={Classes.BREADCRUMB}>
        {name}
      </Link>
    </li>
  );
};

const QueryNav: FC = () => {
  const { name, id } = useRouteMatch<{ name: string; id: string }>().params;
  return (
    <li>
      <Link to={`/console/clients/${name}/queries/${id}`} className={Classes.BREADCRUMB}>
        Query #{id}
      </Link>
    </li>
  );
};

const ClientIndexNav = () => (
  <li>
    <Link to="/console/clients/" className={Classes.BREADCRUMB}>
      Client Accounts
    </Link>
  </li>
);

type NavbarProps = {
  isNightMode: boolean;
  onNightModeChange: (isNightMode: boolean) => void;
};

const QNavbar: FC<NavbarProps> = ({ isNightMode, onNightModeChange }) => {
  return (
    <Navbar fixedToTop>
      <NavbarGroup align="left">
        <ul className={Classes.BREADCRUMBS}>
          <Route component={TopNav} />
          <Route path="/console/clients/" component={ClientIndexNav} />
          <Route path="/console/clients/:name" component={ClientAppNav} />
          <Route path="/console/clients/:name/queries/:id" component={QueryNav} />
        </ul>
      </NavbarGroup>
      <NavbarGroup align="right">
        <Link
          className={[Classes.BUTTON, Classes.MINIMAL, iconClass(IconNames.APPLICATION)].join(' ')}
          to="/console/clients/"
        >
          Client Accounts
        </Link>
        <span className={Classes.NAVBAR_DIVIDER} />
        {!isNightMode && <Button className={Classes.MINIMAL} onClick={() => onNightModeChange(true)} icon="moon" />}
        {isNightMode && (
          <Button
            className={Classes.MINIMAL}
            onClick={() => onNightModeChange(false)}
            icon="flash"
            intent={Intent.WARNING}
          />
        )}
      </NavbarGroup>
    </Navbar>
  );
};

export default QNavbar;
