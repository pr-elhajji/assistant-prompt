import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();
    return (
        <footer>
            <a href="https://github.com/pr-elhajji" target="_blank" rel="noopener noreferrer">{t('footer_credits')}</a> - 
            <a target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr" rel="noreferrer"> {t('footer_license')}</a>
        </footer>
    );
};

export default Footer;
