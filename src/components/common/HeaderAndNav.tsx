import React, { useState } from 'react';
import { Header } from './Header';
import { Nav } from './Nav';

export const HeaderAndNav: React.FC = () => {
  const [navShown, setNavShown] = useState<boolean>(false);
  const toggleNavShown = () => {
    setNavShown(!navShown);
  };
  const hideNav = () => {
    setNavShown(false);
  };
  return (
    <>
      <Header {...{ toggleNavShown }} />
      <Nav {...{ navShown, hideNav }} />
    </>
  );
};
