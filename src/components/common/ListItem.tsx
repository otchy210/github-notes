import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../../utils/classNames';
import { formatTime } from '../../utils/formatTime';
import { Draft, DraftMeta } from '../../utils/useLocalStorage';

type Props = {
  draft: Draft & DraftMeta;
  remove: (key: string) => void;
};

export const ListItem: React.FC<Props> = ({ draft, remove }: Props) => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const toggleMenuOpened = () => {
    setMenuOpened(!menuOpened);
  };
  return (
    <li className={classNames({ 'menu-opened': menuOpened })}>
      <Link to={`/edit?key=${draft.key}`}>
        <h3>{draft.title}</h3>
        <small>
          {draft.updatedAt ? `${formatTime(draft.updatedAt)} - ` : ''}
          {draft.body}
        </small>
      </Link>
      <div className="icon-more" onClick={toggleMenuOpened}>
        <img src="/images/icon-more.svg" />
      </div>
      <div className="menu" onClick={() => remove(draft.key)}>
        <img src="/images/icon-delete.svg" />
      </div>
    </li>
  );
};
