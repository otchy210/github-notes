import React, { useEffect, useState } from 'react';
import { Edit } from '../columns/Edit';
import { Home } from '../columns/Home';
import { Preview } from '../columns/Preview';
import { Page } from './Page';
import { useURLSearchParams } from '../../hooks/useURLSearchParams';
import { useNavigate } from 'react-router-dom';

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
  const params = useURLSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paramKey = params.get('key');
    if (paramKey) {
      setKey(paramKey);
    } else {
      const newKey = createNewKey();
      navigate(`/edit?key=${newKey}`, { replace: true });
      setKey(createNewKey());
    }
  }, []);

  if (!key) {
    return null;
  }

  return (
    <Page>
      <Home priority={3} />
      <Edit {...{ key, priority: mode === 'edit' ? 1 : 2 }} />
      <Preview priority={mode === 'preview' ? 1 : 2} />
    </Page>
  );
};
