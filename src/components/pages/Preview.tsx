import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useGitHub } from '../../providers/GitHubProvider';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { View } from '../common/View';

export const Preview: React.FC = () => {
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
    await client.pushNote(key, draft);
    localStorage.removeDraft(key);
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
          <div className="icon" onClick={save}>
            <img src="/images/icon-save.svg" />
          </div>
        </div>
      </header>
      <main>
        <View text={draft} />
      </main>
    </>
  );
};
