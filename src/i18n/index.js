import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import te from './te.json';
import hi from './hi.json';
import es from './es.json';
import fr from './fr.json';
import de from './de.json';

const resources = {
  en: { translation: en },
  te: { translation: te },
  hi: { translation: hi },
  es: { translation: es },
  fr: { translation: fr },
  de: { translation: de },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
