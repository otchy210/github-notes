import React, { ReactNode } from 'react';

export type Priority = 1 | 2 | 3;

type Props = {
  children?: ReactNode;
  priority: Priority;
};

export const Column: React.FC<Props> = ({ priority, children }) => {
  return <div className={`column prio-${priority}`}>{children}</div>;
};
