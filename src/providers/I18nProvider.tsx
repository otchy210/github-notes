import i18next from 'i18next';
import React, { ReactNode, useEffect, useState } from 'react';
import { createContext, useContext } from 'react';
import { useLocalStorage } from '../utils/useLocalStorage';
import HttpApi from 'i18next-http-backend';

export type LanguageKey = 'en' | 'ja';

type Language = {
  key: LanguageKey;
  label: string;
  flag: string;
};

export const LANGUAGES: Language[] = [
  { key: 'en', label: 'English', flag: '🇬🇧' },
  { key: 'ja', label: 'Japanese', flag: '🇯🇵' },
];
// t('English') t('Japanese')

type I18nContextValue = {
  langKey: LanguageKey;
  setLangKey: (langKey: LanguageKey) => void;
  isReady: boolean;
  t: (key: string, dangerousHTML?: boolean) => string;
};

const getLangKey = (): LanguageKey => {
  const ls = useLocalStorage();
  const storedKey = ls.get('languageKey', '');
  if (storedKey.length > 0) {
    return storedKey as LanguageKey;
  }
  const keys = LANGUAGES.map((lang) => lang.key);
  const foundKey = navigator.languages.find((key) => {
    return keys.includes(key as LanguageKey);
  });
  if (foundKey) {
    ls.set('languageKey', foundKey);
    return foundKey as LanguageKey;
  }
  return LANGUAGES[0].key;
};

const I18nContext = createContext<I18nContextValue>({
  langKey: getLangKey(),
  setLangKey: () => {
    throw new Error();
  },
  isReady: false,
  t: i18next.t,
});

export const useI18n = (): I18nContextValue => {
  return useContext(I18nContext);
};

type Props = {
  children: ReactNode;
};

const I18nProvider: React.FC<Props> = ({ children }) => {
  const [langKey, setStateLangKey] = useState<LanguageKey>(getLangKey());
  const [isReady, setIsReady] = useState<boolean>(false);
  const ls = useLocalStorage();
  const setLangKey = (langKey: LanguageKey) => {
    i18next.changeLanguage(langKey).then(() => {
      setStateLangKey(langKey);
      ls.set('languageKey', langKey);
    });
  };
  useEffect(() => {
    i18next
      .use(HttpApi)
      .init({
        lng: langKey,
        fallbackLng: ['en'],
        backend: {
          loadPath: '/locales/{{lng}}.json',
        },
        returnEmptyString: false,
        nsSeparator: ':::',
        keySeparator: '::',
        pluralSeparator: '__',
        contextSeparator: '__',
      })
      .then(() => {
        setIsReady(true);
      });
  }, []);
  const t = (key: string, dangerousHTML = false) => {
    if (dangerousHTML) {
      return i18next.t(key, { interpolation: { escapeValue: false } });
    } else {
      return i18next.t(key);
    }
  };
  return <I18nContext.Provider value={{ langKey, setLangKey, isReady, t }}>{children}</I18nContext.Provider>;
};

export default I18nProvider;
