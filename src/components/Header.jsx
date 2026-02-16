import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages, BookMarked, Settings, CircleHelp } from 'lucide-react';

const Header = ({ onOpenSaved, onOpenSettings, onOpenHelp }) => {
    const { t, i18n } = useTranslation();

    const toggleLanguage = () => {
        const currentLang = i18n.language.split('-')[0];
        let newLang = 'fr';
        if (currentLang === 'fr') newLang = 'en';
        else if (currentLang === 'en') newLang = 'ar';
        else newLang = 'fr'; // ar -> fr or default

        i18n.changeLanguage(newLang);
    };

    return (
        <header>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src="/logo.png" alt="Logo" style={{ height: '32px' }} />
                <h1>{t('title')}</h1>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={onOpenSaved} className="btn btn-secondary" title={t('saved_prompts')}>
                    <BookMarked size={18} />
                </button>
                <button onClick={onOpenSettings} className="btn btn-secondary" title={t('settings_title') || "Settings"}>
                    <Settings size={18} />
                </button>
                <button onClick={onOpenHelp} className="btn btn-secondary" title={t('help_title') || "Help"}>
                    <CircleHelp size={18} />
                </button>
                <button onClick={toggleLanguage} className="btn btn-secondary" style={{ gap: '0.5rem', display: 'flex', alignItems: 'center' }}>
                    <Languages size={18} />
                    {i18n.language.split('-')[0].toUpperCase()}
                </button>
            </div>
        </header>
    );
};

export default Header;
