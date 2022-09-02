import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useGitHub } from '../../providers/GitHubProvider';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { Render } from '../common/Render';

export const Preview: React.FC = () => {
  const [saving, setSaving] = useState<boolean>(false);
  const params = useURLSearchParams();
  const { client } = useGitHub();
  const key = params.get('key');
  if (!key) {
    console.error(`key has to be provided`);
    return null;
  }
  const localStorage = useLocalStorage();
  const draft = localStorage.getDraft(key);
  const navigate = useNavigate();
  const save = async () => {
    if (!client) {
      console.error("Can't access GitHub");
      return;
    }
    setSaving(true);
    await client.pushNote(key, draft);
    localStorage.removeDraft(key);
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
      <main>
        <Render text={draft} />
      </main>
    </>
  );
};
