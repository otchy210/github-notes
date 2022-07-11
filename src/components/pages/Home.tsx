import React, { useEffect } from 'react';
import { useOctokit } from '../../utils/useOctokit';

export const Home: React.FC = () => {
  useEffect(() => {
    const api = useOctokit();
    if (!api) {
      return;
    }
    api.users.getAuthenticated().then((user) => {
      console.log(user);
    });
  }, []);
  return <div>Home</div>;
};
