import React, { useContext, useEffect, useState } from 'react';
import { Octokit } from '@octokit/rest';
import { createContext, ReactNode } from 'react';
import { useLocalStorage } from '../utils/useLocalStorage';
import { GitHubClient } from '../utils/GitHubClient';

const REPO_STR = /git@github\.com:([^/]+)\/([^.]+)\.git/;
const parseRepoStr = (repo: string) => {
  const results = REPO_STR.exec(repo);
  if (!results) {
    return false;
  }
  return { owner: results[1], repo: results[2] };
};

type GitHubUser = {
  id: number;
  login: string;
  name: string | null;
  htmlUrl: string;
  avatarUrl: string;
};

type RepoStatus = 'unknown' | 'unavaiable' | 'empty' | 'invalid' | 'avaiable' | 'error';

export type GitHubRepo = {
  apiParam: {
    owner: string;
    repo: string;
  };
  defaultBranch: string;
  private: boolean;
  htmlUrl: string;
};

type GitHubContextValues = {
  accessToken?: string;
  user?: GitHubUser;
  repoName?: string;
  repoStatus: RepoStatus;
  repo?: GitHubRepo;
  client?: GitHubClient;
  setAccessToken: (accessToken: string) => void;
  setRepository: (accessToken: string) => void;
};

const GitHubContext = createContext<GitHubContextValues>({
  repoStatus: 'unknown',
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

export const GitHubProvider: React.FC<Props> = ({ children }) => {
  const localStorage = useLocalStorage();
  const [initialLoad, setInitialLoad] = useState<boolean>(true);
  const [accessToken, setAccessTokenState] = useState<string>(localStorage.get('accessToken', ''));
  const [api, setApi] = useState<Octokit>();
  const [user, setUser] = useState<GitHubUser>();
  const [repoName, setRepoName] = useState<string>(localStorage.get('repository', ''));
  const [repoStatus, setRepoStatus] = useState<RepoStatus>('unknown');
  const [repo, setRepo] = useState<GitHubRepo>();
  const [client, setClient] = useState<GitHubClient>();

  const setAccessToken = (accessToken: string) => {
    localStorage.set('accessToken', accessToken);
    setAccessTokenState(accessToken);
  };

  const setRepository = (repository: string) => {
    localStorage.set('repository', repository);
    setRepoName(repository);
  };

  const setRepoAndStatus = (repo: GitHubRepo | undefined, repoStatus: RepoStatus) => {
    setRepo(repo);
    setRepoStatus(repoStatus);
    if (api !== undefined && repo !== undefined && repoStatus === 'avaiable') {
      const client = new GitHubClient(api, repo);
      setClient(client);
    } else {
      setClient(undefined);
    }
  };

  useEffect(() => {
    const api = new Octokit({ auth: accessToken, userAgent: 'GitHub Notes', baseUrl: 'https://api.github.com' });
    setApi(api);
  }, [accessToken]);

  useEffect(() => {
    if (!api) {
      // initial load
      return;
    }
    api.users
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
        setRepoAndStatus(undefined, 'unavaiable');
        setUser(undefined);
      });
  }, [api]);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      return;
    }
    if (!api || !user) {
      setRepoAndStatus(undefined, 'unavaiable');
      return;
    }
    if (!repoName) {
      setRepoAndStatus(undefined, 'empty');
      return;
    }
    const parsedRepoStr = parseRepoStr(repoName);
    if (parsedRepoStr === false) {
      setRepoAndStatus(undefined, 'invalid');
      return;
    }
    api.repos
      .get(parsedRepoStr)
      .then(({ data }) => {
        const repo: GitHubRepo = {
          apiParam: {
            owner: data.owner.login,
            repo: data.name,
          },
          defaultBranch: data.default_branch,
          private: data.private,
          htmlUrl: data.html_url,
        };
        setRepoAndStatus(repo, 'avaiable');
      })
      .catch((e) => {
        console.error(e);
        setRepoAndStatus(undefined, 'error');
      });
  }, [repoName, user]);
  return (
    <GitHubContext.Provider value={{ accessToken, user, repoName, repoStatus, repo, client, setAccessToken, setRepository }}>{children}</GitHubContext.Provider>
  );
};

export const useGitHub = (): GitHubContextValues => {
  return useContext(GitHubContext);
};
