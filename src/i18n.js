import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {
  DEFAULT_LANGUAGE,
  normalizeLanguageCode,
  persistLanguage,
  resolveInitialLanguage,
} from './services/languageDetectionService';

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
import welcomeID from './locales/id/welcome.json';
import welcomeEN from './locales/en/welcome.json';
import characterID from './locales/id/character.json';
import characterEN from './locales/en/character.json';
import introsimID from './locales/id/introsim.json';
import introsimEN from './locales/en/introsim.json';
import contactID from './locales/id/contact.json';
import contactEN from './locales/en/contact.json';

const resources = {
  id: {
    common: commonID,
    home: homeID,
    simulation: simulationID,
    nuclearpedia: nuclearpediaID,
    about: aboutID,
    education: educationID,
    welcome: welcomeID,
    character: characterID,
    introsim: introsimID,
    contact: contactID,
  },
  en: {
    common: commonEN,
    home: homeEN,
    simulation: simulationEN,
    nuclearpedia: nuclearpediaEN,
    about: aboutEN,
    education: educationEN,
    welcome: welcomeEN,
    character: characterEN,
    introsim: introsimEN,
    contact: contactEN,
  },
};

let i18nInitializationPromise = null;

export const initializeI18n = async () => {
  if (i18nInitializationPromise) {
    return i18nInitializationPromise;
  }

  i18nInitializationPromise = (async () => {
    const initialLanguage = await resolveInitialLanguage();

    await i18n
      .use(initReactI18next)
      .init({
        resources,
        lng: initialLanguage,
        fallbackLng: DEFAULT_LANGUAGE,
        supportedLngs: ['id', 'en'],
        load: 'languageOnly',
        defaultNS: 'common',
        interpolation: {
          escapeValue: false,
        },
      });

    persistLanguage(initialLanguage);

    i18n.on('languageChanged', (language) => {
      persistLanguage(normalizeLanguageCode(language));
    });

    return i18n;
  })();

  return i18nInitializationPromise;
};

export default i18n;
