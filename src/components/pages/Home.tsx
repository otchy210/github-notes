import React, { useEffect } from 'react';
import { useOctokit } from '../../hooks/useOctokit';

export const Home: React.FC = () => {
  useEffect(() => {
    const auth = prompt('access token?');
    if (!auth) {
      return;
    }
    const api = useOctokit(auth);
    api.users.getAuthenticated().then((user) => {
      console.log(user);
    });
  }, []);
  return <div>Home</div>;
};
