import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { DatabaseProvider } from '../providers/DatabaseProvider';
import { GitHubProvider } from '../providers/GitHubProvider';
import { Config } from './pages/Config';
import { Edit } from './pages/Edit';
import { Home } from './pages/Home';
import { Preview } from './pages/Preview';

export const App: React.FC = () => {
  return (
    <GitHubProvider>
      <DatabaseProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/config" element={<Config />} />
            <Route path="/edit" element={<Edit />} />
            <Route path="/preview" element={<Preview />} />
          </Routes>
        </HashRouter>
      </DatabaseProvider>
    </GitHubProvider>
  );
};
