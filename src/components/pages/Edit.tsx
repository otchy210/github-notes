import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useLocalStorage } from '../../utils/useLocalStorage';

export const Edit: React.FC = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const params = useURLSearchParams();
  const key = params.get('key');
  const localStorage = useLocalStorage();

  const navigate = useNavigate();
  useEffect(() => {
    if (key) {
      const draft = localStorage.getDraft(key);
      if (textareaRef.current) {
        textareaRef.current.value = draft;
      }
      return;
    }
    const newKey = 'dummy-key';
    navigate(`/edit?key=${newKey}`, { replace: true });
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
