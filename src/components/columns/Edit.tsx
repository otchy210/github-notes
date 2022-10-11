import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Column, Priority } from './Column';

type Props = {
  key: string;
  priority: Priority;
  note: string;
  onChange: (note: string) => void;
};

export const Edit: React.FC<Props> = ({ key, priority, note, onChange }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (priority === 1) {
      textareaRef.current?.focus();
    }
  }, []);

  return (
    <Column {...{ priority }}>
      <header>
        <div className="icon-holder">
          <Link to="/">
            <div className="icon">
              <img src="/images/icon-back.svg" />
            </div>
          </Link>
        </div>
        <div className="icon-holder">
          <Link to={`/preview?key=${key}`}>
            <div className="icon">
              <img src="/images/icon-preview.svg" />
            </div>
          </Link>
        </div>
      </header>
      <article>
        <div className="editor">
          <textarea ref={textareaRef} value={note} onChange={(e) => onChange(e.target.value)} />
        </div>
      </article>
    </Column>
  );
};
