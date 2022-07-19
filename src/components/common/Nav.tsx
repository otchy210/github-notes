import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
  navShown: boolean;
  hideNav: () => void;
};

export const Nav: React.FC<Props> = ({ navShown, hideNav }: Props) => {
  const left = navShown ? '0' : '-100%';
  return (
    <nav style={{ left }}>
      <ul>
        <li>
          <Link to="/" onClick={() => hideNav()} className="text">
            Home
          </Link>
        </li>
        <li>
          <Link to="/config" onClick={() => hideNav()} className="text">
            Config
          </Link>
        </li>
      </ul>
    </nav>
  );
};
