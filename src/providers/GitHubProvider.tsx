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
  repository?: string;
  setAccessToken: (accessToken: string) => void;
  setRepository: (accessToken: string) => void;
};

const GitHubContext = createContext<GitHubContextValues>({
  setAccessToken: (accessToken: string) => {
    console.error(`setAccessToken is not yer ready. Following value was not stored: ${accessToken}`);
  },
  setRepository: (repository: string) => {
    console.error(`setRepository is not yer ready. Following value was not stored: ${repository}`);
  },
});

type Props = {
  children: ReactNode;
};

type RepositoryStatus = 'unknown' | 'empty' | 'invalid' | 'valid';

export const GitHubProvider: React.FC<Props> = ({ children }) => {
  const localStorage = useLocalStorage();
  const [accessToken, setAccessTokenState] = useState<string>(localStorage.get('accessToken', ''));
  const [api, setApi] = useState<Octokit>();
  const [user, setUser] = useState<GitHubUser>();
  const [repository, setRepositoryState] = useState<string>(localStorage.get('repository', ''));
  const [repositoryStatus, setRepositoryStatus] = useState<RepositoryStatus>('unknown');

  const setAccessToken = (accessToken: string) => {
    localStorage.set('accessToken', accessToken);
    setAccessTokenState(accessToken);
  };

  const setRepository = (repository: string) => {
    localStorage.set('repository', repository);
    setRepositoryState(repository);
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

  useEffect(() => {
    if (!api || !user) {
      setRepositoryStatus('unknown');
      return;
    }
    if (!repository) {
      setRepositoryStatus('empty');
      return;
    }
    api.repos.get({ owner: 'otchy210', repo: 'github-notes' }).then(({ data }) => {
      console.log(data);
    });
  }, [repository, user]);
  return <GitHubContext.Provider value={{ accessToken, api, user, repository, setAccessToken, setRepository }}>{children}</GitHubContext.Provider>;
};

export const useGitHub = (): GitHubContextValues => {
  return useContext(GitHubContext);
};
