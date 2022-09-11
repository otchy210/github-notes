import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { DatabaseProvider } from '../providers/DatabaseProvider';
import { GitHubProvider } from '../providers/GitHubProvider';
import { SearchQueryProvider } from '../providers/SearchQueryProvider';
import { Config } from './pages/Config';
import { Edit } from './pages/Edit';
import { Home } from './pages/Home';
import { Preview } from './pages/Preview';
import { View } from './pages/View';

export const App: React.FC = () => {
  return (
    <GitHubProvider>
      <DatabaseProvider>
        <SearchQueryProvider>
          <HashRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/config" element={<Config />} />
              <Route path="/edit" element={<Edit />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/view" element={<View />} />
            </Routes>
          </HashRouter>
        </SearchQueryProvider>
      </DatabaseProvider>
    </GitHubProvider>
  );
};
