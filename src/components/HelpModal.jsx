import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Github, ExternalLink } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2>{t('help_title')}</h2>
                    <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.5rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <div style={{ padding: '1rem', lineHeight: '1.6' }}>
                    <p>{t('help_content')}</p>

                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <a
                            href="https://github.com/pr-elhajji/assistant-prompt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none' }}
                        >
                            <Github size={20} />
                            {t('repo_link')} <ExternalLink size={16} />
                        </a>
                    </div>

                    <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <p>{t('version')}: 1.0.0</p>
                        <p>{t('contact')}: <a href="https://github.com/pr-elhajji" target="_blank" rel="noopener noreferrer">@pr-elhajji</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
