import React from 'react';
import { Link } from 'react-router-dom';
import { formatTime } from '../../utils/formatTime';
import { Draft, DraftMeta } from '../../utils/useLocalStorage';

type Props = {
  draft: Draft & DraftMeta;
};

export const ListItem: React.FC<Props> = ({ draft }: Props) => {
  return (
    <li>
      <Link to={`/edit?key=${draft.key}`}>
        <h3>{draft.title}</h3>
        <small>
          {draft.updatedAt ? `${formatTime(draft.updatedAt)} - ` : ''}
          {draft.body}
        </small>
      </Link>
      <div className="icon-more">
        <img src="/images/icon-more.svg" />
      </div>
    </li>
  );
};
