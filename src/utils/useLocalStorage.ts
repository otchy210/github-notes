const prefix = 'GitHubNotes-';
const prefixDraft = `${prefix}Draft-`;
const prefixDraftMeta = `${prefixDraft}Meta-`;

export type LocalStorageNames = 'accessToken' | 'repository';

type Draft = {
  key: string;
  title: string;
  body: string;
};

type DraftMeta = {
  updatedAt: number;
};

type LocalStorage = {
  get: (name: LocalStorageNames, defaultValue?: string) => string;
  set: (name: LocalStorageNames, value: string) => LocalStorage;
  getDraft: (key: string) => string;
  setDraft: (key: string, draft: string) => LocalStorage;
  listDraft: () => (Draft & DraftMeta)[];
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
    const meta: DraftMeta = {
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(`${prefixDraftMeta}${key}`, JSON.stringify(meta));
    return localStorage;
  },
  listDraft: (): (Draft & DraftMeta)[] => {
    return Object.entries(window.localStorage)
      .filter(([key]) => {
        return key.startsWith(prefixDraft) && !key.startsWith(prefixDraftMeta);
      })
      .map(([lsKey, draft]) => {
        const key = lsKey.slice(prefixDraft.length);
        const lines = draft.split('\n');
        const title = lines.length > 0 ? lines[0] : '<empty>';
        const body = lines.length > 1 ? lines.slice(1).join(' ') : '<empty>';
        const metaStr = window.localStorage.getItem(`${prefixDraftMeta}${key}`);
        const meta: DraftMeta = metaStr ? (JSON.parse(metaStr) as DraftMeta) : { updatedAt: 0 };
        return { key, title, body, ...meta };
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
