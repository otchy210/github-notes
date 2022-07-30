import React from 'react';
import { useGitHub } from '../../providers/GitHubProvider';
import { Guide } from './Guide';
import { List } from './List';

export const Home: React.FC = () => {
  const { client } = useGitHub();
  return <>{client ? <List /> : <Guide />}</>;
};
