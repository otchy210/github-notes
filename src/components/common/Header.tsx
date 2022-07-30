import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGitHub } from '../../providers/GitHubProvider';

type Props = {
  toggleNavShown: () => void;
};

export const Header: React.FC<Props> = ({ toggleNavShown }: Props) => {
  const { user } = useGitHub();
  const [userPanelShown, setUserPanelShown] = useState<boolean>(false);
  const toggleUserPanelShown = () => {
    setUserPanelShown(!userPanelShown);
  };
  return (
    <header>
      <div className="icon-holder">
        <div className="icon menu" onClick={() => toggleNavShown()}>
          <img src="/images/icon-menu.svg" />
        </div>
      </div>
      <form className="search">
        <div>
          <input placeholder="Search notes" />
        </div>
      </form>
      <div className="icon-holder">
        <div className="icon user" onClick={() => toggleUserPanelShown()}>
          {user ? <img src={user.avatarUrl} /> : <img src="/images/icon-icon.svg" />}
        </div>
      </div>
      {userPanelShown ? (
        <div className="user-panel">
          <div>
            <div className="avatar">{user ? <img src={user.avatarUrl} /> : <img src="/images/icon-user.svg" />}</div>
          </div>
          <div>{user ? user.name || user.id : 'Unknown'} </div>
          <hr />
          <div>
            <Link to="/config?focus=accessToken" onClick={() => setUserPanelShown(false)} className="text">
              {user ? 'Logout' : 'Login'}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
};
