import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export const Edit: React.FC = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  return (
    <>
      <header>
        <div className="icon-holder">
          <Link to="/">
            <div className="icon">
              <img src="/images/icon-back.svg" />
            </div>
          </Link>
        </div>
        <div className="icon-holder">
          <div className="icon">
            <img src="/images/icon-preview.svg" />
          </div>
        </div>
      </header>
      <main>
        <div className="editor">
          <textarea ref={textareaRef}></textarea>
        </div>
      </main>
    </>
  );
};
