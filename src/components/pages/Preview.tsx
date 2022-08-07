import React from 'react';
import { Link } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { View } from '../common/View';

export const Preview: React.FC = () => {
  const params = useURLSearchParams();
  const key = params.get('key');
  if (!key) {
    console.error(`key has to be provided`);
    return null;
  }
  const localStorage = useLocalStorage();
  const draft = localStorage.getDraft(key);
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
      </header>
      <main>
        <View text={draft} />
      </main>
    </>
  );
};
