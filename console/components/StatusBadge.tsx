import { Tag, Intent } from '@blueprintjs/core';
import * as React from 'react';
import { FC, PropsWithChildren } from 'react';

function getIntent(children: PropsWithChildren<any>['children']) {
  switch (children) {
    case 'pending':
      return Intent.NONE;
    case 'running':
      return Intent.PRIMARY;
    case 'retried':
      return Intent.WARNING;
    case 'failed':
    case 'error':
      return Intent.DANGER;
    case 'success':
      return Intent.SUCCESS;
    default:
      return Intent.NONE;
  }
}

const StatusBadge: FC = ({ children }) => {
  return <Tag intent={getIntent(children)}>{children}</Tag>;
};

export default StatusBadge;
