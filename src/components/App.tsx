import { Collection } from '@otchy/sim-doc-db';
import { Field } from '@otchy/sim-doc-db/dist/types';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { Header } from './common/Header';
import { Config } from './pages/Config';
import { Home } from './pages/Home';

export const App: React.FC = () => {
  const fileds: Field[] = [{ name: 'key', type: 'tag', indexed: true }];
  const collection = new Collection(fileds);
  collection.add({ values: { key: 'aaa' } });
  const result = collection.find({ key: 'aaa' });
  console.log(Array.from(result));
  console.log(collection.export());

  return (
    <HashRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </main>
    </HashRouter>
  );
};
