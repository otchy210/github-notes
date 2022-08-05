import React from 'react';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { ListItem } from '../common/ListItem';
import { NewNote } from '../common/NewNote';

export const List: React.FC = () => {
  const localStorage = useLocalStorage();
  const drafts = localStorage.listDraft();
  return (
    <div className="list">
      <h2>Draft</h2>
      <ul>
        {drafts.map((draft) => (
          <ListItem draft={draft} />
        ))}
      </ul>
      <NewNote />
    </div>
  );
};
