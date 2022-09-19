import { Note, NoteMeta } from '../types';

const prefix = 'GitHubNotes-';
const prefixDraft = `${prefix}Draft-`;
const prefixDraftMeta = `${prefixDraft}Meta-`;

export type LocalStorageNames = 'accessToken' | 'repository' | 'languageKey';

type LocalStorage = {
  get: (name: LocalStorageNames, defaultValue?: string) => string;
  set: (name: LocalStorageNames, value: string) => LocalStorage;
  getDraft: (key: string) => string;
  setDraft: (key: string, draft: string) => LocalStorage;
  removeDraft: (key: string) => LocalStorage;
  listDraft: () => Note[];
};

const localStorage: LocalStorage = {
  get: (name: LocalStorageNames, defaultValue = ''): string => {
    return window.localStorage.getItem(`${prefix}${name}`) ?? defaultValue;
  },
  set: (name: LocalStorageNames, value: string): LocalStorage => {
    window.localStorage.setItem(`${prefix}${name}`, value);
    return localStorage;
  },
  getDraft: (key: string): string => {
    return window.localStorage.getItem(`${prefixDraft}${key}`) ?? '';
  },
  setDraft: (key: string, draft: string) => {
    window.localStorage.setItem(`${prefixDraft}${key}`, draft);
    const meta: NoteMeta = {
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(`${prefixDraftMeta}${key}`, JSON.stringify(meta));
    return localStorage;
  },
  removeDraft: (key: string) => {
    window.localStorage.removeItem(`${prefixDraft}${key}`);
    window.localStorage.removeItem(`${prefixDraftMeta}${key}`);
    return localStorage;
  },
  listDraft: (): Note[] => {
    return Object.entries(window.localStorage)
      .filter(([key]) => {
        return key.startsWith(prefixDraft) && !key.startsWith(prefixDraftMeta);
      })
      .map(([lsKey, content]) => {
        const key = lsKey.slice(prefixDraft.length);
        const metaStr = window.localStorage.getItem(`${prefixDraftMeta}${key}`);
        const meta: NoteMeta = metaStr ? (JSON.parse(metaStr) as NoteMeta) : { updatedAt: 0 };
        return { key, content, ...meta };
      })
      .sort((left, right) => {
        return right.updatedAt - left.updatedAt;
      });
  },
};

export const useLocalStorage = () => {
  return localStorage;
};

export const NAMES = {};
