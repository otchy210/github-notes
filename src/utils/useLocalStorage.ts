const prefix = 'GitHubNotes-';
const prefixDraft = `${prefix}Draft-`;

export type LocalStorageNames = 'accessToken' | 'repository';

type Draft = {
  key: string;
  title: string;
  body: string;
};

type LocalStorage = {
  get: (name: LocalStorageNames, defaultValue?: string) => string;
  set: (name: LocalStorageNames, value: string) => LocalStorage;
  getDraft: (key: string) => string;
  setDraft: (key: string, draft: string) => LocalStorage;
  listDraft: () => Draft[];
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
  listDraft: (): Draft[] => {
    return Object.entries(window.localStorage)
      .filter(([key]) => {
        return key.startsWith(prefixDraft);
      })
      .sort(([keyLeft], [keyRight]) => {
        return keyLeft.localeCompare(keyRight) * -1;
      })
      .map(([key, draft]) => {
        const lines = draft.split('\n');
        const title = lines.length > 0 ? lines[0] : '<empty>';
        const body = lines.length > 1 ? lines.slice(1).join(' ') : '<empty>';
        return { key: key.slice(prefixDraft.length), title, body };
      });
  },
};

export const useLocalStorage = () => {
  return localStorage;
};

export const NAMES = {};
