import React from 'react';
import { useGitHub } from '../../providers/GitHubProvider';

type Props = {
  toggleNavShown: () => void;
};

export const Header: React.FC<Props> = ({ toggleNavShown }: Props) => {
  const { user } = useGitHub();
  return (
    <header>
      <div className="icon-holder">
        <div className="icon menu" onClick={() => toggleNavShown()}>
          <img src="/images/menu-icon.svg" />
        </div>
      </div>
      <form className="search">
        <div>
          <input placeholder="Search notes" />
        </div>
      </form>
      <div className="icon-holder">
        <div className="icon user">{user ? <img src={user.avatarUrl} /> : <img src="/images/user-icon.svg" />}</div>
      </div>
    </header>
  );
};
