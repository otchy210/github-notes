import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Column, Priority } from './Column';

type Props = {
  noteKey: string;
  priority: Priority;
  note: string;
  onChange: (note: string) => void;
  setScrollRatio: (scrollRatio: number) => void;
};

export const Edit: React.FC<Props> = ({ noteKey, priority, note, onChange, setScrollRatio }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (priority !== 1 || !textareaRef.current) {
      return;
    }
    const textarea = textareaRef.current;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(0, 0);
      textarea.scrollTop = 0;
    }, 0);
  }, [noteKey]);

  const onScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const textarea = e.target as HTMLTextAreaElement;
    const ratio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
    setScrollRatio(ratio);
  };

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
        <div className="icon-holder hide-2cols">
          <Link to={`/preview?key=${noteKey}`}>
            <div className="icon">
              <img src="/images/icon-preview.svg" />
            </div>
          </Link>
        </div>
      </header>
      <article>
        <div className="editor">
          <textarea ref={textareaRef} value={note} onChange={(e) => onChange(e.target.value)} onScroll={onScroll} />
        </div>
      </article>
    </Column>
  );
};
