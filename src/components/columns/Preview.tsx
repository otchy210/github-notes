import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../../providers/DatabaseProvider';
import { useGitHub } from '../../providers/GitHubProvider';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { Render } from '../common/Render';
import { Column, Priority } from './Column';

type Props = {
  noteKey: string;
  priority: Priority;
  note: string;
};

export const Preview: React.FC<Props> = ({ noteKey, priority, note }) => {
  const [saving, setSaving] = useState<boolean>(false);
  const { client: git } = useGitHub();
  const { client: db } = useDatabase();
  if (!git) {
    console.error("Can't access GitHub");
    return null;
  }
  if (!db) {
    console.error("Can't access DB");
    return null;
  }
  const localStorage = useLocalStorage();
  const navigate = useNavigate();
  const save = async () => {
    setSaving(true);
    await git.pushNote(noteKey, note);
    localStorage.removeDraft(noteKey);
    const latestDb = await git.getDb();
    db.import(latestDb);
    db.addOrUpdate({ key: noteKey, content: note, updatedAt: Date.now() });
    await git.pushDb(db.export());
    setSaving(false);
    navigate('/');
  };
  return (
    <Column {...{ priority }}>
      <header>
        <div className="icon-holder hide-2cols">
          <Link to={`/edit?key=${noteKey}`}>
            <div className="icon">
              <img src="/images/icon-back.svg" />
            </div>
          </Link>
        </div>
        <div className="icon-holder">
          {saving ? (
            <div className="icon loading">
              <img src="/images/icon-circle.svg" />
            </div>
          ) : (
            <div className="icon" onClick={save}>
              <img src="/images/icon-save.svg" />
            </div>
          )}
        </div>
      </header>
      <article>
        <Render text={note} />
      </article>
    </Column>
  );
};
