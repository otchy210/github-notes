import React, { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export const Column: React.FC<Props> = ({ children }) => {
  return <div className="column">{children}</div>;
};
