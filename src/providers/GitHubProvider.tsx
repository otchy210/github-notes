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

type RepoStatus = undefined | 'empty' | 'invalid' | 'public' | 'private' | 'error';

type GitHubContextValues = {
  accessToken?: string;
  api?: Octokit;
  user?: GitHubUser;
  repo?: string;
  repoStatus?: RepoStatus;
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

const REPO_STR = /git@github\.com:([^/]+)\/([^.]+)\.git/;
const parseRepoStr = (repo: string) => {
  const results = REPO_STR.exec(repo);
  if (!results) {
    return false;
  }
  return { owner: results[1], repo: results[2] };
};

export const GitHubProvider: React.FC<Props> = ({ children }) => {
  const localStorage = useLocalStorage();
  const [accessToken, setAccessTokenState] = useState<string>(localStorage.get('accessToken', ''));
  const [api, setApi] = useState<Octokit>();
  const [user, setUser] = useState<GitHubUser>();
  const [repo, setRepState] = useState<string>(localStorage.get('repository', ''));
  const [repoStatus, setRepoStatus] = useState<RepoStatus>();

  const setAccessToken = (accessToken: string) => {
    localStorage.set('accessToken', accessToken);
    setAccessTokenState(accessToken);
  };

  const setRepository = (repository: string) => {
    localStorage.set('repository', repository);
    setRepState(repository);
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
      setRepoStatus(undefined);
      return;
    }
    if (!repo) {
      setRepoStatus('empty');
      return;
    }
    const parsedRepoStr = parseRepoStr(repo);
    if (parsedRepoStr === false) {
      setRepoStatus('invalid');
      return;
    }
    api.repos
      .get(parsedRepoStr)
      .then(({ data }) => {
        if (data.private) {
          setRepoStatus('private');
        } else {
          setRepoStatus('public');
        }
      })
      .catch((e) => {
        console.error(e);
        setRepoStatus('error');
      });
  }, [repo, user]);
  return <GitHubContext.Provider value={{ accessToken, api, user, repo, repoStatus, setAccessToken, setRepository }}>{children}</GitHubContext.Provider>;
};

export const useGitHub = (): GitHubContextValues => {
  return useContext(GitHubContext);
};
