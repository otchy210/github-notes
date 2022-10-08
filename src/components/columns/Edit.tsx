import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useLocalStorage } from '../../utils/useLocalStorage';
import { Column } from './Column';

const createNewKey = () => {
  const now = Date.now();
  const intArr = [];
  for (let i = 3; i >= 0; i--) {
    const shift = i * 8;
    const mask = 0xff << shift;
    const num = (mask & now) >> shift;
    intArr.push(num);
  }
  const randInt = Math.trunc(Math.random() * 0xffffffffffff);
  for (let i = 7; i >= 0; i--) {
    const shift = i * 8;
    const mask = 0xff << shift;
    const num = (mask & randInt) >> shift;
    intArr.push(num);
  }
  const uint8Array = new Uint8Array(intArr);
  return window
    .btoa(String.fromCharCode.apply(null, Array.from(uint8Array)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

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
    const newKey = createNewKey();
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
    <Column>
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
