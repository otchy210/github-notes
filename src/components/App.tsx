import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import { Config } from './pages/Config';
import { Home } from './pages/Home';

export const App: React.FC = () => {
  return (
    <HashRouter>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/config">Config</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/config" element={<Config />} />
      </Routes>
    </HashRouter>
  );
};
