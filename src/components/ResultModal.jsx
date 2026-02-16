import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Save, X, ExternalLink } from 'lucide-react';

const ResultModal = ({ isOpen, onClose, prompt, onSave }) => {
    const { t } = useTranslation();
    const [copySuccess, setCopySuccess] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(prompt);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };

    const providers = [
        { name: 'ChatGPT', url: 'https://chat.openai.com/' },
        { name: 'Claude', url: 'https://claude.ai/' },
        { name: 'Gemini', url: 'https://gemini.google.com/' },
        { name: 'Mistral Le Chat', url: 'https://chat.mistral.ai/' },
        { name: 'Grok', url: 'https://twitter.com/i/grok' },
        { name: 'DuckDuckGo AI', url: 'https://duckduckgo.com/?q=DuckDuckGo&ia=chat' },
        { name: 'Vittascience', url: 'https://fr.vittascience.com/ia/text.php' },
        { name: 'Euria', url: 'https://euria.infomaniak.com/' },
        { name: 'Lumo', url: 'https://lumo.proton.me/guest' }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('modify_prompt')}</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <textarea
                    value={prompt}
                    readOnly
                    className="width-100"
                    rows={10}
                    style={{ marginBottom: '1rem' }}
                />

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onSave} title={t('save')}>
                        <Save size={18} /> {t('save')}
                    </button>
                    <button className={`btn ${copySuccess ? 'btn-success' : 'btn-primary'}`} onClick={handleCopy}>
                        <Copy size={18} /> {copySuccess ? t('copied') || "Copié !" : t('copy')}
                    </button>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <h3>{t('test_on')}</h3>
                    <div className="provider-links">
                        {providers.map(p => (
                            <a key={p.name} href={p.url} target="_blank" rel="noreferrer">
                                {p.name} <ExternalLink size={12} style={{ marginLeft: 4 }}/>
                            </a>
                        ))}
                    </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <h3>{t('translate_to_english')}</h3>
                    <div className="provider-links">
                        <a href="https://www.deepl.com/fr/translator" target="_blank" rel="noreferrer">
                            DeepL
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultModal;
