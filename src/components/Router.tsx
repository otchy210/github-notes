import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { useI18n } from '../providers/I18nProvider';
import { Edit } from './columns/Edit';
import { Preview } from './columns/Preview';
import { ConfigPage } from './pages/ConfigPage';
import { HomePage } from './pages/HomePage';
import { ViewPage } from './pages/ViewPage';

export const Router: React.FC = () => {
  const { isReady } = useI18n();
  if (!isReady) {
    return null;
  }
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/config" element={<ConfigPage />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/view" element={<ViewPage />} />
      </Routes>
    </HashRouter>
  );
};
