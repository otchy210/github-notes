import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const useURLSearchParams = () => {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
};

export const useNonReactURLSearchParams = () => {
  const { search } = window.location;
  return new URLSearchParams(search);
};
