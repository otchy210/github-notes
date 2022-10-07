import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { useI18n } from '../providers/I18nProvider';
import { Config } from './columns/Config';
import { Edit } from './columns/Edit';
import { Home } from './columns/Home';
import { Preview } from './columns/Preview';
import { View } from './columns/View';

export const Router: React.FC = () => {
  const { isReady } = useI18n();
  if (!isReady) {
    return null;
  }
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/config" element={<Config />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/view" element={<View />} />
      </Routes>
    </HashRouter>
  );
};
