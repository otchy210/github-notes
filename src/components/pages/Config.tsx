import React from 'react';
import { useGitHub } from '../../providers/GitHubProvider';

export const Config: React.FC = () => {
  const { accessToken, setAccessToken } = useGitHub();
  return (
    <>
      <h2>GitHub Personal access token</h2>
      <p>The secret will be stored on your browser so no one except you can check the value.</p>
      <p>
        <input
          type="password"
          value={accessToken}
          placeholder="Enter your access token"
          onChange={(e) => {
            setAccessToken(e.target.value);
          }}
        />
      </p>
    </>
  );
};
