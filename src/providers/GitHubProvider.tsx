import React, { useContext, useEffect, useState } from 'react';
import { Octokit } from '@octokit/rest';
import { createContext, ReactNode } from 'react';
import { useLocalStorage } from '../utils/useLocalStorage';

type GitHubUser = {
  id: number;
  login: string;
  name: string | null;
  htmlUrl: string;
  avatarUrl: string;
};

type GitHubContextValues = {
  accessToken?: string;
  api?: Octokit;
  user?: GitHubUser;
  setAccessToken: (accessToken: string) => void;
};

const GitHubContext = createContext<GitHubContextValues>({
  setAccessToken: (accessToken: string) => {
    console.error(`setAccessToken is not yer ready. Following value was not stored: ${accessToken}`);
  },
});

type Props = {
  children: ReactNode;
};

export const GitHubProvider: React.FC<Props> = ({ children }) => {
  const localStorage = useLocalStorage();
  const [accessToken, setAccessTokenState] = useState<string>(localStorage.get('accessToken'));
  const [api, setApi] = useState<Octokit>();
  const [user, setUser] = useState<GitHubUser>();

  const setAccessToken = (accessToken: string) => {
    localStorage.set('accessToken', accessToken);
    setAccessTokenState(accessToken);
  };

  useEffect(() => {
    const api = new Octokit({ auth: accessToken, userAgent: 'GitHub Notes', baseUrl: 'https://api.github.com' });
    setApi(api);
  }, [accessToken]);

  useEffect(() => {
    api?.users
      .getAuthenticated()
      .then(({ data }) => {
        const user: GitHubUser = {
          id: data.id,
          login: data.login,
          name: data.name,
          htmlUrl: data.html_url,
          avatarUrl: data.avatar_url,
        };
        setUser(user);
      })
      .catch((e) => {
        console.warn(e);
        setUser(undefined);
      });
  }, [api]);
  return <GitHubContext.Provider value={{ accessToken, api, user, setAccessToken }}>{children}</GitHubContext.Provider>;
};

export const useGitHub = (): GitHubContextValues => {
  return useContext(GitHubContext);
};
