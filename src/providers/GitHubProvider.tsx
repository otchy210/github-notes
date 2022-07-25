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

type RepoStatus = undefined | 'empty' | 'invalid' | 'avaiable' | 'error';

type GitHubRepo = {
  apiParam: {
    owner: string;
    repo: string;
  };
  defaultBranch: string;
  private: boolean;
};

type GitHubContextValues = {
  accessToken?: string;
  api?: Octokit;
  user?: GitHubUser;
  repoName?: string;
  repoStatus?: RepoStatus;
  repo?: GitHubRepo;
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
  const [repoName, setRepoName] = useState<string>(localStorage.get('repository', ''));
  const [repoStatus, setRepoStatus] = useState<RepoStatus>();
  const [repo, setRepo] = useState<GitHubRepo>();

  const setAccessToken = (accessToken: string) => {
    localStorage.set('accessToken', accessToken);
    setAccessTokenState(accessToken);
  };

  const setRepository = (repository: string) => {
    localStorage.set('repository', repository);
    setRepoName(repository);
  };

  const setRepoAndStatus = (repo: GitHubRepo | undefined, repoStatus: RepoStatus | undefined) => {
    setRepo(repo);
    setRepoStatus(repoStatus);
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
      setRepoAndStatus(undefined, undefined);
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
        };
        setRepoAndStatus(repo, 'avaiable');
      })
      .catch((e) => {
        console.error(e);
        setRepoAndStatus(undefined, 'error');
      });
  }, [repoName, user]);
  return (
    <GitHubContext.Provider value={{ accessToken, api, user, repoName, repoStatus, repo, setAccessToken, setRepository }}>{children}</GitHubContext.Provider>
  );
};

export const useGitHub = (): GitHubContextValues => {
  return useContext(GitHubContext);
};
