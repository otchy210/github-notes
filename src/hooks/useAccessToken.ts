import { useState } from 'react';
import { useLocalStorage } from '../utils/useLocalStorage';

type ReturnType = [string, (accessToken: string) => void];

export const useAccessToken = () => {
  const localStorage = useLocalStorage();
  const [accessToken, setAccessToken] = useState<string>(localStorage.get('accessToken'));
  return [
    accessToken,
    (accessToken: string) => {
      localStorage.set('accessToken', accessToken);
      setAccessToken(accessToken);
    },
  ] as ReturnType;
};
