import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { useI18n } from '../providers/I18nProvider';
import { ConfigPage } from './pages/ConfigPage';
import { EditPage } from './pages/EditPage';
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
        <Route path="/edit" element={<EditPage mode="edit" />} />
        <Route path="/preview" element={<EditPage mode="preview" />} />
        <Route path="/view" element={<ViewPage />} />
      </Routes>
    </HashRouter>
  );
};
