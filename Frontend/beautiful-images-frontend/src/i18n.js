import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en.json';
import translationHE from './locales/he.json';

const resources = {
  en: {
    translation: translationEN,
  },
  he: {
    translation: translationHE,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en', // Default language if the translation is missing
    keySeparator: false,
    interpolation: {
      escapeValue: false, // React already sanitizes values
    },
  });

export default i18n;
