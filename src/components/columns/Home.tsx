import React from 'react';
import { useGitHub } from '../../providers/GitHubProvider';
import { HeaderAndNav } from '../common/HeaderAndNav';
import { Guide } from './Guide';
import { List } from './List';

export const Home: React.FC = () => {
  const { repoStatus, client } = useGitHub();
  return (
    <>
      <HeaderAndNav />
      <article className="home">
        {repoStatus === 'unknown' ? (
          <div className="icon loading">
            <img src="/images/icon-circle.svg" />
          </div>
        ) : client ? (
          <List />
        ) : (
          <Guide />
        )}
      </article>
    </>
  );
};
