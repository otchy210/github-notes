import React from 'react';
import { Link } from 'react-router-dom';

export const NewNote: React.FC = () => {
  return (
    <Link to="/edit">
      <div className="new-note">
        <img src="/images/icon-new-note.svg" />
      </div>
    </Link>
  );
};
