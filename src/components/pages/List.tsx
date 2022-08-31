import React, { useEffect, useState } from 'react';
import { useDatabase } from '../../providers/DatabaseProvider';
import { Note } from '../../types';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { ListItem } from '../common/ListItem';
import { NewNote } from '../common/NewNote';

export const List: React.FC = () => {
  const localStorage = useLocalStorage();
  const [drafts, setDrafts] = useState<Note[]>(localStorage.listDraft());
  const [notes, setNotes] = useState<Note[]>([]);
  const { client: db } = useDatabase();
  const removeDraft = (key: string) => {
    localStorage.removeDraft(key);
    setDrafts(localStorage.listDraft());
  };
  const removeNote = (key: string) => {
    console.log(`Remove note: ${key}`);
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
            {drafts.map((note) => (
              <ListItem note={note} remove={removeDraft} key={note.key} />
            ))}
          </ul>
        </>
      )}
      {notes.length > 0 && (
        <>
          <h2>Notes</h2>
          <ul>
            {notes.map((note) => (
              <ListItem note={note} remove={removeNote} key={note.key} />
            ))}
          </ul>
        </>
      )}
      <NewNote />
    </div>
  );
};
