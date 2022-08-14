import { Document } from '@otchy/sim-doc-db/dist/types';
import React, { useEffect, useState } from 'react';
import { useDatabase } from '../../providers/DatabaseProvider';
import { Draft, DraftMeta, useLocalStorage } from '../../utils/useLocalStorage';
import { ListItem } from '../common/ListItem';
import { NewNote } from '../common/NewNote';

export const List: React.FC = () => {
  const localStorage = useLocalStorage();
  const [drafts, setDrafts] = useState<(Draft & DraftMeta)[]>(localStorage.listDraft());
  const [notes, setNotes] = useState<Document[]>([]);
  const { collection } = useDatabase();
  const remove = (key: string) => {
    localStorage.removeDraft(key);
    setDrafts(localStorage.listDraft());
  };
  useEffect(() => {
    if (!collection) {
      setNotes([]);
      return;
    }
    const notes = collection.getAll();
    const sortedNotes = Array.from(notes).sort((left, right) => {
      // TODO: Type values correctly
      const leftUpdatedAt = left.values.updatedAt as number;
      const rightUpdatedAt = right.values.updatedAt as number;
      return rightUpdatedAt - leftUpdatedAt;
    });
    setNotes(sortedNotes);
  }, [collection]);
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
                  {note.values.key} {note.values.content} {note.values.updatedAt}
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
