import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { DatabaseClient } from '../utils/DatabaseClient';
import { useGitHub } from './GitHubProvider';

type DatabaseContextValues = {
  client?: DatabaseClient;
};

const DatabaseContext = createContext<DatabaseContextValues>({});

type Props = {
  children: ReactNode;
};

export const DatabaseProvider: React.FC<Props> = ({ children }) => {
  const [client, setClient] = useState<DatabaseClient>();
  const { client: git } = useGitHub();
  useEffect(() => {
    const client = new DatabaseClient();
    if (!git) {
      setClient(client);
      return;
    }
    git
      .getDb()
      .then((db) => {
        client.import(db);
        setClient(client);
      })
      .catch((e) => {
        console.warn(e);
        setClient(client);
      });
  }, [git]);
  return <DatabaseContext.Provider value={{ client }}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = (): DatabaseContextValues => {
  return useContext(DatabaseContext);
};
