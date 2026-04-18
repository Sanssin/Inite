const DEFAULT_LANGUAGE = 'id';
const LANGUAGE_STORAGE_KEY = 'i18nextLng';
const IP_LOOKUP_TIMEOUT_MS = 3000;

const GEOLOCATION_APIS = [
  { name: 'ipapi', url: 'https://ipapi.co/json/' },
  { name: 'ipwhois', url: 'https://ipwho.is/?fields=success,country_code' },
];

const normalizeLanguageCode = (language) => {
  if (!language || typeof language !== 'string') {
    return DEFAULT_LANGUAGE;
  }

  const baseLanguage = language.toLowerCase().split('-')[0];
  return baseLanguage === 'en' ? 'en' : 'id';
};

const getStoredLanguage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (!storedLanguage) {
      return null;
    }

    return normalizeLanguageCode(storedLanguage);
  } catch (error) {
    console.warn('Failed to read language from localStorage:', error);
    return null;
  }
};

const persistLanguage = (language) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguageCode(language));
  } catch (error) {
    console.warn('Failed to persist language in localStorage:', error);
  }
};

const parseCountryCode = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const rawCountryCode = payload.country_code || payload.countryCode;
  if (typeof rawCountryCode !== 'string' || rawCountryCode.trim().length < 2) {
    return null;
  }

  return rawCountryCode.trim().toUpperCase().slice(0, 2);
};

const fetchCountryCodeFromApi = async ({ name, url }) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), IP_LOOKUP_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const payload = await response.json();

    if (name === 'ipwhois' && payload.success === false) {
      throw new Error('API returned unsuccessful response');
    }

    const countryCode = parseCountryCode(payload);
    if (!countryCode) {
      throw new Error('Country code is unavailable');
    }

    return countryCode;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const detectLanguageFromIP = async () => {
  for (const api of GEOLOCATION_APIS) {
    try {
      const countryCode = await fetchCountryCodeFromApi(api);
      return countryCode === 'ID' ? 'id' : 'en';
    } catch (error) {
      console.warn(`Failed to detect country via ${api.name}:`, error);
    }
  }

  console.warn('All IP geolocation providers failed, using fallback language "id".');
  return DEFAULT_LANGUAGE;
};

export const resolveInitialLanguage = async () => {
  const storedLanguage = getStoredLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  const detectedLanguage = await detectLanguageFromIP();
  persistLanguage(detectedLanguage);
  return detectedLanguage;
};

export {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  normalizeLanguageCode,
  persistLanguage,
};
