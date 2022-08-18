import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useDatabase } from '../../providers/DatabaseProvider';
import { useGitHub } from '../../providers/GitHubProvider';
import { HeaderAndNav } from '../common/HeaderAndNav';

type RepoStructureStatus = undefined | 'empty' | 'invalid' | 'avaiable' | 'error';

export const Config: React.FC = () => {
  const { user, accessToken, repoName, repoStatus, repo, client: git, setAccessToken, setRepository } = useGitHub();
  const accessTokenRef = useRef<HTMLInputElement>(null);
  const params = useURLSearchParams();
  const focus = params.get('focus');
  const [repoStructureStatus, setRepoStructureStatus] = useState<RepoStructureStatus>();
  const [initializingRepo, setInitializingRepo] = useState<boolean>(false);
  const { client: db } = useDatabase();
  const [recreatingIndex, setRecreatingIndex] = useState<boolean>(false);

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
    if (!git) {
      return;
    }
    git
      .getHeadTree()
      .then(({ data }) => {
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
            console.error(`Unknown state: ${data.tree}`);
            setRepoStructureStatus('error');
        }
      })
      .catch((e) => {
        console.error(e);
        setRepoStructureStatus('error');
      });
  }, [repo]);

  const initializeRepo = () => {
    if (!git) {
      return;
    }
    const confirmed = window.confirm('Are you sure to initialize the repository? It may override what you have now.');
    if (!confirmed) {
      return;
    }
    setInitializingRepo(true);
    (async () => {
      const metaReadme = await git.createTextBlob('# DO NOT EDIT THIS FOLDER MANUALLY');
      const notesReadme = await git.createTextBlob('# DO NOT EDIT THIS FOLDER MANUALLY');
      git
        .pushBlobs('Initialize repo', [
          { blob: metaReadme, path: 'meta/README.md' },
          { blob: notesReadme, path: 'notes/README.md' },
        ])
        .then(() => {
          setRepoStructureStatus('avaiable');
        })
        .catch((e) => {
          console.error(e);
          setRepoStructureStatus('error');
        })
        .finally(() => {
          setInitializingRepo(false);
        });
    })();
  };
  const recreateIndex = async () => {
    if (!git || !db) {
      return;
    }
    setRecreatingIndex(true);
    const notesTree = await git.getNotesTree();
    const keys = notesTree.data.tree
      .map(({ path }) => path)
      .filter((path) => {
        return path && path.endsWith('.md') && path !== 'README.md';
      })
      .map((path) => path?.split('.')[0] ?? '');
    console.log(keys);
    const promises = keys.map((key) => git.getNote(key));
    const notes = await Promise.all(promises);
    db.refresh(notes);
    console.log(notes);
    // TODO: save it in git
    console.log(db.export());
    setRecreatingIndex(false);
  };
  return (
    <>
      <HeaderAndNav />
      <main className="config">
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
            <p>Your repository need some folders to store notes and metadata. So you need to initialize your repository before using it.</p>
            {repoStructureStatus === 'empty' && <p className="warn">Your repository is not yet initialized. Click following button to initialize it.</p>}
            {repoStructureStatus === 'invalid' && (
              <p className="error">
                <a href={repo.htmlUrl} target="_blank">
                  Your repository
                </a>{' '}
                has somewhat invalid state. Make sure it's expected then you can click following button to initialize it.
              </p>
            )}
            {repoStructureStatus === 'error' && (
              <p className="error">
                <a href={repo.htmlUrl} target="_blank">
                  Your repository
                </a>{' '}
                returns error. You may find the hint in the DevTools console. If the repository is just empty, you need to push initial commit first to start
                using this repository.
              </p>
            )}
            {repoStructureStatus === 'avaiable' ? (
              <p className="info">Your repository is ready to use.</p>
            ) : (
              <button onClick={initializeRepo} disabled={initializingRepo}>
                {initializingRepo ? 'Processing...' : 'Initialize'}
              </button>
            )}
          </>
        )}
        {repo && repoStructureStatus === 'avaiable' && (
          <>
            <h2>Recreate database index</h2>
            <p>
              You can recreate database index by pushing following button. You don't need to do this usually because it should be done automatically. But in
              case your database index is broken due to for example race condition, you can fix the problem by recreating database index.
            </p>
            <p className="warn">Note that it can take long time based on number of notes</p>
            <button onClick={recreateIndex} disabled={recreatingIndex}>
              {recreatingIndex ? 'Processing...' : 'Recreate index'}
            </button>
          </>
        )}
      </main>
    </>
  );
};
