import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { Column, Priority } from './Column';

type Props = {
  key: string;
  priority: Priority;
};

export const Edit: React.FC<Props> = ({ key, priority }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const localStorage = useLocalStorage();

  useEffect(() => {
    const draft = localStorage.getDraft(key);
    if (textareaRef.current) {
      textareaRef.current.value = draft;
    }
  }, [key]);

  useEffect(() => {
    textareaRef.current?.focus();
    let prevDraft = textareaRef.current?.value;
    const tid = window.setInterval(() => {
      if (textareaRef.current && key) {
        const draft = textareaRef.current.value;
        if (draft !== prevDraft) {
          localStorage.setDraft(key, draft);
        }
        prevDraft = draft;
      }
    }, 500);
    return () => {
      clearInterval(tid);
    };
  }, [key]);

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
          <textarea ref={textareaRef}></textarea>
        </div>
      </article>
    </Column>
  );
};
