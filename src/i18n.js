import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import commonID from './locales/id/common.json';
import commonEN from './locales/en/common.json';
import homeID from './locales/id/home.json';
import homeEN from './locales/en/home.json';
import simulationID from './locales/id/simulation.json';
import simulationEN from './locales/en/simulation.json';
import nuclearpediaID from './locales/id/nuclearpedia.json';
import nuclearpediaEN from './locales/en/nuclearpedia.json';
import aboutID from './locales/id/about.json';
import aboutEN from './locales/en/about.json';
import educationID from './locales/id/education.json';
import educationEN from './locales/en/education.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: {
        common: commonID,
        home: homeID,
        simulation: simulationID,
        nuclearpedia: nuclearpediaID,
        about: aboutID,
        education: educationID
      },
      en: {
        common: commonEN,
        home: homeEN,
        simulation: simulationEN,
        nuclearpedia: nuclearpediaEN,
        about: aboutEN,
        education: educationEN
      }
    },
    fallbackLng: 'id',
    defaultNS: 'common',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
