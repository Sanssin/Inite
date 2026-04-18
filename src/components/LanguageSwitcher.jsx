import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = ({ onLanguageChange }) => {
    const { i18n } = useTranslation();
    const currentLang = (i18n.resolvedLanguage || i18n.language || 'id').toLowerCase().startsWith('en') ? 'en' : 'id';

    const toggleLanguage = async (event) => {
        event.preventDefault();
        const newLang = currentLang === 'id' ? 'en' : 'id';
        await i18n.changeLanguage(newLang);

        if (typeof onLanguageChange === 'function') {
            onLanguageChange();
        }
    };

    return (
        <a
            className="language-switcher nav-link"
            href="#switch-language"
            onClick={toggleLanguage}
            aria-label="Switch Language"
            title={currentLang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
            {currentLang === 'id' ? 'English' : 'Indonesia'}
        </a>
    );
};

export default LanguageSwitcher;
