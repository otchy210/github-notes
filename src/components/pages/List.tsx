import React from 'react';
import { Link } from 'react-router-dom';
import { formatTime } from '../../utils/formatTime';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { NewNote } from '../common/NewNote';

export const List: React.FC = () => {
  const localStorage = useLocalStorage();
  const drafts = localStorage.listDraft();
  return (
    <div className="list">
      <h2>Draft</h2>
      <ul>
        {drafts.map((draft) => {
          return (
            <li>
              <Link to={`/edit?key=${draft.key}`}>
                <h3>{draft.title}</h3>
                <small>
                  {draft.updatedAt ? `${formatTime(draft.updatedAt)} - ` : ''}
                  {draft.body}
                </small>
              </Link>
            </li>
          );
        })}
      </ul>
      <NewNote />
    </div>
  );
};
