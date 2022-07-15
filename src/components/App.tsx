import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { Header } from './common/Header';
import { Nav } from './common/Nav';
import { Config } from './pages/Config';
import { Home } from './pages/Home';

export const App: React.FC = () => {
  const [navShown, setNavShown] = useState<boolean>(false);
  const toggleNavShown = () => {
    setNavShown(!navShown);
  };
  const hideNav = () => {
    setNavShown(false);
  };

  return (
    <HashRouter>
      <Header {...{ toggleNavShown }} />
      <Nav {...{ navShown, hideNav }} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/config" element={<Config />} />
        </Routes>
      </main>
    </HashRouter>
  );
};
