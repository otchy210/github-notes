import React from 'react';
import { Home } from '../columns/Home';
import { Page } from './Page';

export const HomePage: React.FC = () => {
  return (
    <Page>
      <Home />
    </Page>
  );
};
