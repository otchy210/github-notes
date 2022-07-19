import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useGitHub } from '../../providers/GitHubProvider';

export const Config: React.FC = () => {
  const { accessToken, setAccessToken } = useGitHub();
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
      <form>
        <input
          type="password"
          value={accessToken}
          placeholder="Enter your access token"
          onChange={(e) => {
            setAccessToken(e.target.value);
          }}
          ref={accessTokenRef}
        />
      </form>
      {accessToken && <p>Remove above token to logout.</p>}
    </>
  );
};
