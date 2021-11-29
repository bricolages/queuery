import React, { ReactElement, useEffect, useState } from 'react';
import { Spinner, Classes, AnchorButton, Intent } from '@blueprintjs/core';
import { Flex } from '@rebass/grid';

import { UNAUTHORIZED } from '../resources';

type Props<C> = {
  content: C | undefined | typeof UNAUTHORIZED;
  children: (content: C) => ReactElement<any>;
};

type LazyContentComponent = <C>(props: Props<C>) => ReactElement<any> | null;

export const LazyContent: LazyContentComponent = ({ content, children }) => {
  const [isSpinnerShown, setIsSpinnerShown] = useState(false);

  useEffect(() => {
    if (content) return;
    const timeoutId = setTimeout(() => setIsSpinnerShown(true), 300);
    return () => clearTimeout(timeoutId);
  }, [content]);

  if (content === UNAUTHORIZED) {
    return (
      <Flex alignSelf="center" justifyContent="center" m={3}>
        <AnchorButton href="/auth/azure_oauth2" intent={Intent.PRIMARY} className={Classes.LARGE}>
          Login
        </AnchorButton>
      </Flex>
    );
  }
  if (typeof content !== 'undefined') {
    return children(content);
  }
  if (isSpinnerShown) {
    return (
      <Flex alignSelf="center" justifyContent="center" m={3}>
        <Spinner />
      </Flex>
    );
  }
  return null;
};
