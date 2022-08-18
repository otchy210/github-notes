import { Document } from '@otchy/sim-doc-db/dist/types';
import React, { useEffect, useState } from 'react';
import { useDatabase } from '../../providers/DatabaseProvider';
import { Note } from '../../types';
import { Draft, DraftMeta, useLocalStorage } from '../../utils/useLocalStorage';
import { ListItem } from '../common/ListItem';
import { NewNote } from '../common/NewNote';

export const List: React.FC = () => {
  const localStorage = useLocalStorage();
  const [drafts, setDrafts] = useState<(Draft & DraftMeta)[]>(localStorage.listDraft());
  const [notes, setNotes] = useState<Note[]>([]);
  const { client: db } = useDatabase();
  const remove = (key: string) => {
    localStorage.removeDraft(key);
    setDrafts(localStorage.listDraft());
  };
  useEffect(() => {
    if (!db) {
      setNotes([]);
      return;
    }
    const notes = db.getAll();
    const sortedNotes = notes.sort((left, right) => {
      return right.updatedAt - left.updatedAt;
    });
    setNotes(sortedNotes);
  }, [db]);
  return (
    <div className="list">
      {drafts.length > 0 && (
        <>
          <h2>Draft</h2>
          <ul>
            {drafts.map((draft) => (
              <ListItem draft={draft} remove={remove} key={draft.key} />
            ))}
          </ul>
        </>
      )}
      {notes.length > 0 && (
        <>
          <h2>Notes</h2>
          <ul>
            {notes.map((note) => {
              return (
                <li>
                  {note.key} {note.content} {note.updatedAt}
                </li>
              );
            })}
          </ul>
        </>
      )}
      <NewNote />
    </div>
  );
};
