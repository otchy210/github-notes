import React, { useEffect, useRef, useState } from 'react';
import { Edit } from '../columns/Edit';
import { Home } from '../columns/Home';
import { Preview } from '../columns/Preview';
import { Page } from './Page';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../utils/useLocalStorage';

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

type Mode = 'edit' | 'preview';

type Props = {
  mode: Mode;
};

export const EditPage: React.FC<Props> = ({ mode }) => {
  const [key, setKey] = useState<string>();
  const [note, setNoteState] = useState<string>('');
  const [scrollRatio, setScrollRatio] = useState<number>(0);
  const params = useURLSearchParams();
  const paramKey = params.get('key');
  const navigate = useNavigate();
  const localStorage = useLocalStorage();
  const tidRef = useRef<number>(0);

  useEffect(() => {
    if (paramKey) {
      setKey(paramKey);
    } else {
      const newKey = createNewKey();
      navigate(`/edit?key=${newKey}`, { replace: true });
      setKey(createNewKey());
    }
  }, [paramKey]);

  useEffect(() => {
    if (!key) {
      return;
    }
    const draft = localStorage.getDraft(key);
    setNoteState(draft);
  }, [key]);

  if (!key) {
    return null;
  }

  const setNote = (note: string) => {
    setNoteState(note);
    window.clearTimeout(tidRef.current);
    tidRef.current = window.setTimeout(() => {
      localStorage.setDraft(key, note);
    }, 500);
  };

  return (
    <Page>
      <Home priority={3} />
      <Edit noteKey={key} priority={mode === 'edit' ? 1 : 2} onChange={setNote} {...{ note, setScrollRatio }} />
      <Preview noteKey={key} priority={mode === 'preview' ? 1 : 2} {...{ note, scrollRatio }} />
    </Page>
  );
};
