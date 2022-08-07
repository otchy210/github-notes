import React from 'react';
import { useGitHub } from '../../providers/GitHubProvider';
import { HeaderAndNav } from '../common/HeaderAndNav';
import { Guide } from './Guide';
import { List } from './List';

export const Home: React.FC = () => {
  const { client } = useGitHub();
  return (
    <>
      <HeaderAndNav />
      <main className="home">{client ? <List /> : <Guide />}</main>
    </>
  );
};
