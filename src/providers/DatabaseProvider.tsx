import { Collection } from '@otchy/sim-doc-db';
import { Field } from '@otchy/sim-doc-db/dist/types';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useGitHub } from './GitHubProvider';

const dbSchema: Field[] = [
  {
    name: 'key',
    type: 'tag',
    indexed: true,
  },
  {
    name: 'content',
    type: 'string',
    indexed: true,
  },
  {
    name: 'updatedAt',
    type: 'number',
    indexed: false,
  },
];

type DatabaseContextValues = {
  collection?: Collection;
};

const DatabaseContext = createContext<DatabaseContextValues>({});

type Props = {
  children: ReactNode;
};

export const DatabaseProvider: React.FC<Props> = ({ children }) => {
  const [collection, setCollection] = useState<Collection>();
  const { client } = useGitHub();
  useEffect(() => {
    const newCollection = new Collection(dbSchema);
    if (!client) {
      setCollection(newCollection);
      return;
    }
    client
      .getDb()
      .then((db) => {
        newCollection.import(db);
        setCollection(newCollection);
      })
      .catch((e) => {
        console.warn(e);
        // TODO: load actual data
        for (let i = 1; i <= 3; i++) {
          newCollection.add({
            values: {
              key: `key${i}`,
              content: `dummy content ${i}`,
              updatedAt: i,
            },
          });
        }
        setCollection(newCollection);
      });
  }, [client]);
  return <DatabaseContext.Provider value={{ collection }}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = (): DatabaseContextValues => {
  return useContext(DatabaseContext);
};
