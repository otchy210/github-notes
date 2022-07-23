import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useGitHub } from '../../providers/GitHubProvider';

export const Config: React.FC = () => {
  const { user, accessToken, repo, repoStatus, setAccessToken, setRepository } = useGitHub();
  const accessTokenRef = useRef<HTMLInputElement>(null);
  const params = useURLSearchParams();
  const focus = params.get('focus');
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
          <p>Your notes will be storead in this repository. It's highly recommended to created a dedicated repository for this purpose.</p>
          <p>
            Your access token configured above has to have a permission to read and write this repository. It's recommended to make your repository private.
            Otherwise, anyone can read your notes.
          </p>
          <input
            type="text"
            value={repo}
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
          {repoStatus === 'public' && <p className="warn">The repogitory is public repository. So anyone can read your notes.</p>}
        </>
      )}
    </>
  );
};
