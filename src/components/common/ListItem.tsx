import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Note } from '../../types';
import { classNames } from '../../utils/classNames';
import { formatTime } from '../../utils/formatTime';

type Props = {
  note: Note;
  isDraft: boolean;
  remove: (key: string) => void;
};

export const ListItem: React.FC<Props> = ({ note, isDraft, remove }: Props) => {
  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const lines = note.content.split('\n');
  const title = lines.length > 0 ? lines[0] : '<empty>';
  const body = lines.length > 1 ? lines.slice(1).join(' ') : '<empty>';
  const page = isDraft ? 'edit' : 'view';

  const toggleMenuOpened = () => {
    setMenuOpened(!menuOpened);
  };
  return (
    <li className={classNames({ 'menu-opened': menuOpened })}>
      <Link to={`/${page}?key=${note.key}`}>
        <h3>{title}</h3>
        <small>
          {note.updatedAt ? `${formatTime(note.updatedAt)} - ` : ''}
          {body.slice(0, 512)}
        </small>
      </Link>
      <div className="icon-more" onClick={toggleMenuOpened}>
        <img src="/images/icon-more.svg" />
      </div>
      <div className="menu" onClick={() => remove(note.key)}>
        <img src="/images/icon-delete.svg" />
      </div>
    </li>
  );
};
