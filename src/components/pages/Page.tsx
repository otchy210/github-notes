import React, { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export const Page: React.FC<Props> = ({ children }) => {
  return <div className="page">{children}</div>;
};
