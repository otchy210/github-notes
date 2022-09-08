import React, { useEffect, useState } from 'react';
import { useDatabase } from '../../providers/DatabaseProvider';
import { useGitHub } from '../../providers/GitHubProvider';
import { Note } from '../../types';
import { DatabaseClient } from '../../utils/DatabaseClient';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { ListItem } from '../common/ListItem';
import { NewNote } from '../common/NewNote';

const sortedNotes = (db: DatabaseClient): Note[] => {
  const notes = db.getAll();
  return notes.sort((left, right) => {
    return right.updatedAt - left.updatedAt;
  });
};

export const List: React.FC = () => {
  const localStorage = useLocalStorage();
  const [drafts, setDrafts] = useState<Note[]>(localStorage.listDraft());
  const draftKeys = new Set(drafts.map((draft) => draft.key));
  const [notes, setNotes] = useState<Note[]>([]);
  const { client: db } = useDatabase();
  const { client: git } = useGitHub();
  const removeDraft = async (key: string) => {
    localStorage.removeDraft(key);
    setDrafts(localStorage.listDraft());
  };
  const removeNote = async (key: string) => {
    if (!db || !git) {
      return;
    }
    await git.deleteNote(key);
    const latestDb = await git.getDb();
    db.import(latestDb);
    db.remove(key);
    await git.pushDb(db.export());
    setNotes(sortedNotes(db));
  };
  useEffect(() => {
    if (!db) {
      setNotes([]);
      return;
    }
    setNotes(sortedNotes(db));
  }, [db]);
  return (
    <div className="list">
      {drafts.length > 0 && (
        <>
          <h2>Draft</h2>
          <ul>
            {drafts.map((note) => (
              <ListItem note={note} isDraft={true} isDisabled={false} remove={removeDraft} key={note.key} />
            ))}
          </ul>
        </>
      )}
      {notes.length > 0 && (
        <>
          <h2>Notes</h2>
          <ul>
            {notes.map((note) => (
              <ListItem note={note} isDraft={false} isDisabled={draftKeys.has(note.key)} remove={removeNote} key={note.key} />
            ))}
          </ul>
        </>
      )}
      <NewNote />
    </div>
  );
};
