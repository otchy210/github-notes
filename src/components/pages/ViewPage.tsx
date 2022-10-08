import React from 'react';
import { Home } from '../columns/Home';
import { View } from '../columns/View';
import { Page } from './Page';

export const ViewPage: React.FC = () => {
  return (
    <Page>
      <Home />
      <View />
    </Page>
  );
};
