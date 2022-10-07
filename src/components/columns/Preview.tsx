import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useDatabase } from '../../providers/DatabaseProvider';
import { useGitHub } from '../../providers/GitHubProvider';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { Render } from '../common/Render';

export const Preview: React.FC = () => {
  const [saving, setSaving] = useState<boolean>(false);
  const params = useURLSearchParams();
  const { client: git } = useGitHub();
  const { client: db } = useDatabase();
  const key = params.get('key');
  if (!key) {
    console.error(`key has to be provided`);
    return null;
  }
  if (!git) {
    console.error("Can't access GitHub");
    return null;
  }
  if (!db) {
    console.error("Can't access DB");
    return null;
  }
  const localStorage = useLocalStorage();
  const draft = localStorage.getDraft(key);
  const navigate = useNavigate();
  const save = async () => {
    setSaving(true);
    await git.pushNote(key, draft);
    localStorage.removeDraft(key);
    const latestDb = await git.getDb();
    db.import(latestDb);
    db.addOrUpdate({ key, content: draft, updatedAt: Date.now() });
    await git.pushDb(db.export());
    setSaving(false);
    navigate('/');
  };
  return (
    <>
      <header>
        <div className="icon-holder">
          <Link to={`/edit?key=${key}`}>
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
        <Render text={draft} />
      </article>
    </>
  );
};
