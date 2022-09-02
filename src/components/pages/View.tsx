import React from 'react';
import { Link } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useDatabase } from '../../providers/DatabaseProvider';
import { Render } from '../common/Render';

export const View: React.FC = () => {
  const params = useURLSearchParams();
  const key = params.get('key');
  if (!key) {
    console.error(`key has to be provided`);
    return null;
  }
  const { client: db } = useDatabase();
  if (!db) {
    console.error('db is not available');
    return null;
  }
  const note = db.find(key);
  return (
    <>
      <header>
        <div className="icon-holder">
          <Link to={'/'}>
            <div className="icon">
              <img src="/images/icon-back.svg" />
            </div>
          </Link>
        </div>
        <div className="icon-holder"></div>
      </header>
      <main>{note ? <Render text={note.content} /> : `Note not found: ${key}`}</main>
    </>
  );
};
