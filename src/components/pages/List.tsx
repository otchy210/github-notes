import React, { useEffect, useState } from 'react';
import { useDatabase } from '../../providers/DatabaseProvider';
import { useGitHub } from '../../providers/GitHubProvider';
import { useI18n } from '../../providers/I18nProvider';
import { useSearchQuery } from '../../providers/SearchQueryProvider';
import { Note } from '../../types';
import { DatabaseClient } from '../../utils/DatabaseClient';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { ListItem } from '../common/ListItem';
import { NewNote } from '../common/NewNote';

const getNotes = (db: DatabaseClient, query?: string): Note[] => {
  if (query && query.length > 0) {
    return db.search(query);
  } else {
    return db.getAll();
  }
};

const sortedNotes = (db: DatabaseClient, query?: string): Note[] => {
  const notes = getNotes(db, query);
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
  const { query } = useSearchQuery();
  const { t } = useI18n();
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
    setNotes(sortedNotes(db, query));
  }, [db, query]);
  return (
    <div className="list">
      {drafts.length > 0 && query.length === 0 && (
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
          <h2>
            Notes<small style={{ color: 'red' }}>{t('test').toString()}</small>
          </h2>
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
