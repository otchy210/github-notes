import React from 'react';
import { useAccessToken } from '../../hooks/useAccessToken';

export const Config: React.FC = () => {
  const [accessToken, setAccessToken] = useAccessToken();
  return (
    <>
      <h2>GitHub Personal access token</h2>
      <p>The secret will be stored on your browser so no one except you can check the value.</p>
      <p>
        <input
          type="password"
          value={accessToken}
          onChange={(e) => {
            setAccessToken(e.target.value);
          }}
        />
      </p>
    </>
  );
};
