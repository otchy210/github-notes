import React from 'react';
import { useGitHub } from '../../providers/GitHubProvider';
import { HeaderAndNav } from '../common/HeaderAndNav';
import { Column, Priority } from './Column';
import { List } from '../contents/List';
import { Guide } from '../contents/Guide';

type Props = {
  priority: Priority;
};

export const Home: React.FC<Props> = ({ priority }) => {
  const { repoStatus, client } = useGitHub();
  return (
    <Column {...{ priority }}>
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
