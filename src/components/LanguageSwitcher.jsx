import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'id' ? 'en' : 'id';
        i18n.changeLanguage(newLang);
    };

    const currentLang = i18n.language || 'id';

    return (
        <button
            className="language-switcher nav-link"
            onClick={toggleLanguage}
            aria-label="Switch Language"
            title={currentLang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
        >
            {currentLang === 'id' ? 'ENG' : 'IND'}
        </button>
    );
};

export default LanguageSwitcher;
