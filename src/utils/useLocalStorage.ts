const prefix = 'GitHubNotes-';
const prefixDraft = `${prefix}Draft-`;

export type LocalStorageNames = 'accessToken' | 'repository';

type LocalStorage = {
  get: (name: LocalStorageNames, defaultValue?: string) => string;
  set: (name: LocalStorageNames, value: string) => LocalStorage;
  getDraft: (key: string) => string;
  setDraft: (key: string, draft: string) => LocalStorage;
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
    return localStorage;
  },
};

export const useLocalStorage = () => {
  return localStorage;
};

export const NAMES = {};
