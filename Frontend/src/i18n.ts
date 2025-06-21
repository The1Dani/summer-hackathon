// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../src/locales/en/translation.json';
import ro from '../src/locales/ro/translation.json';
import ru from '../src/locales/ru/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ro: { translation: ro }, ru: { translation: ru } },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
