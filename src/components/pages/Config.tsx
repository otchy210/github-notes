import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useGitHub } from '../../providers/GitHubProvider';

type RepoStructureStatus = undefined | 'empty' | 'invalid' | 'avaiable' | 'error';

export const Config: React.FC = () => {
  const { api, user, accessToken, repoName, repoStatus, repo, setAccessToken, setRepository } = useGitHub();
  const accessTokenRef = useRef<HTMLInputElement>(null);
  const params = useURLSearchParams();
  const focus = params.get('focus');
  const [repoStructureStatus, setRepoStructureStatus] = useState<RepoStructureStatus>();

  const navigate = useNavigate();
  useEffect(() => {
    if (!focus) {
      return;
    }
    switch (focus) {
      case 'accessToken':
        accessTokenRef.current?.focus();
        break;
    }
    navigate('/config', { replace: true });
  }, [focus]);

  useEffect(() => {
    if (!api || !repo) {
      return;
    }
    api.repos
      .getCommit({ owner: repo.owner, repo: repo.name, ref: repo.defaultBranch })
      .then(({ data }) => {
        const commitSha = data.sha;
        return api.git.getCommit({ owner: repo.owner, repo: repo.name, commit_sha: commitSha });
      })
      .then(({ data }) => {
        const treeSha = data.tree.sha;
        return api.git.getTree({ owner: repo.owner, repo: repo.name, tree_sha: treeSha });
      })
      .then(({ data }) => {
        console.log(data);
        const directories = data.tree
          .filter((item) => {
            return item.type === 'tree'; // tree == directory
          })
          .filter((item) => {
            return item.path === 'notes' || item.path === 'meta';
          });
        switch (directories.length) {
          case 0:
            setRepoStructureStatus('empty');
            break;
          case 1:
            setRepoStructureStatus('invalid');
            break;
          case 2:
            setRepoStructureStatus('avaiable');
            break;
          default:
            setRepoStructureStatus('error');
        }
      })
      .catch((e) => {
        console.error(e);
        setRepoStructureStatus('error');
      });
  }, [repo]);
  return (
    <>
      <h2>GitHub Personal access token</h2>
      <p>The secret will be stored in your browser so no one except you can check the value.</p>
      <p>As long as you set the proper access token below, you're logged in.</p>
      <input
        type="password"
        value={accessToken}
        placeholder="Enter your access token"
        onChange={(e) => {
          setAccessToken(e.target.value);
        }}
        ref={accessTokenRef}
      />
      {accessToken && <p className="info">Remove above token to logout.</p>}
      {user && (
        <>
          <h2>GitHub repository to store your notes</h2>
          <p>Your notes will be storead in this repository. It's highly recommended to create a dedicated repository for this purpose.</p>
          <p>
            Your access token configured above has to have permissions to read and write this repository. Also, it's recommended to make your repository
            private. Otherwise, anyone can read your notes.
          </p>
          <input
            type="text"
            value={repoName}
            placeholder={`ex) git@github.com:${user.login}/github-notes-data.git`}
            onChange={(e) => {
              setRepository(e.target.value);
            }}
          />
          {repoStatus === 'invalid' && (
            <p className="error">
              Repository should look like{' '}
              <code>
                git@github.com:{'{'}your-login{'}'}/{'{'}your-repo{'}'}.git
              </code>
            </p>
          )}
          {repoStatus === 'error' && <p className="error">Failed to access the repository.</p>}
          {repo && !repo.private && <p className="warn">The repogitory is public. So anyone can read your notes.</p>}
        </>
      )}
      {repo && (
        <>
          <h2>Initialize repository</h2>
          <p>repoStructureStatus: {repoStructureStatus}</p>
          <p className="error">Your repository is not yet initialized. Click following button to initialize it.</p>
        </>
      )}
    </>
  );
};
