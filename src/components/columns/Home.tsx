import React from 'react';
import { useGitHub } from '../../providers/GitHubProvider';
import { HeaderAndNav } from '../common/HeaderAndNav';
import { Column } from './Column';
import { List } from '../contents/List';
import { Guide } from '../contents/Guide';

export const Home: React.FC = () => {
  const { repoStatus, client } = useGitHub();
  return (
    <Column>
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
    </Column>
  );
};
