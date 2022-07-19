import React, { useState } from 'react';
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
          <img src="/images/menu-icon.svg" />
        </div>
      </div>
      <form className="search">
        <div>
          <input placeholder="Search notes" />
        </div>
      </form>
      <div className="icon-holder">
        <div className="icon user" onClick={() => toggleUserPanelShown()}>
          {user ? <img src={user.avatarUrl} /> : <img src="/images/user-icon.svg" />}
        </div>
      </div>
      {userPanelShown ? (
        <div className="user-panel">
          <div>
            <div className="avatar">{user ? <img src={user.avatarUrl} /> : <img src="/images/user-icon.svg" />}</div>
          </div>
          <div>{user ? user.name || user.id : 'Unknown'} </div>
          <hr />
          {user ? <div>Logout</div> : <div>Login</div>}
        </div>
      ) : null}
    </header>
  );
};
