import React from 'react';
import { DatabaseProvider } from '../providers/DatabaseProvider';
import { GitHubProvider } from '../providers/GitHubProvider';
import I18nProvider from '../providers/I18nProvider';
import { SearchQueryProvider } from '../providers/SearchQueryProvider';
import { Router } from './Router';

export const App: React.FC = () => {
  return (
    <GitHubProvider>
      <DatabaseProvider>
        <I18nProvider>
          <SearchQueryProvider>
            <Router />
          </SearchQueryProvider>
        </I18nProvider>
      </DatabaseProvider>
    </GitHubProvider>
  );
};
