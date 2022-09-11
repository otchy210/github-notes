import React, { createContext, ReactNode, useContext, useState } from 'react';

type SearchQueryContextValues = {
  query: string;
  setQuery: (query: string) => void;
};

const SearchQueryContext = createContext<SearchQueryContextValues>({
  query: '',
  setQuery: (query: string) => {
    console.error(`SearchQueryContext is not ready: ${query}`);
  },
});

type Props = {
  children: ReactNode;
};

export const SearchQueryProvider: React.FC<Props> = ({ children }) => {
  const [query, setQuery] = useState<string>('');
  return <SearchQueryContext.Provider value={{ query, setQuery }}>{children}</SearchQueryContext.Provider>;
};

export const useSearchQuery = (): SearchQueryContextValues => {
  return useContext(SearchQueryContext);
};
