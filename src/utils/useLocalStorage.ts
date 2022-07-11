const prefix = 'GitHubNotes-';

export type LocalStorageNames = 'accessToken';

type LocalStorage = {
  get: (name: LocalStorageNames, defaultValue?: string) => string;
  set: (name: LocalStorageNames, value: string) => LocalStorage;
};

const localStorage: LocalStorage = {
  get: (name: LocalStorageNames, defaultValue = ''): string => {
    return window.localStorage.getItem(`${prefix}${name}`) ?? defaultValue;
  },
  set: (name: LocalStorageNames, value: string): LocalStorage => {
    window.localStorage.setItem(`${prefix}${name}`, value);
    return localStorage;
  },
};

export const useLocalStorage = () => {
  return localStorage;
};

export const NAMES = {};
