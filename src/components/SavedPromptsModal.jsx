import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Trash2, Copy } from 'lucide-react';

const SavedPromptsModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [savedPrompts, setSavedPrompts] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const saved = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
            setSavedPrompts(saved); // eslint-disable-line
        }
    }, [isOpen]);

    const handleDelete = (id) => {
        const newPrompts = savedPrompts.filter(p => p.id !== id);
        setSavedPrompts(newPrompts);
        localStorage.setItem('savedPrompts', JSON.stringify(newPrompts));
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        // Toast?
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{t('saved_prompts')}</h2>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                {savedPrompts.length === 0 ? (
                    <p>{t('no_saved_prompts', 'Aucun prompt sauvegardé.')}</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {savedPrompts.map(prompt => (
                            <div key={prompt.id} className="card" style={{ padding: '1rem', marginBottom: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <strong>{prompt.method}</strong>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        {new Date(prompt.date).toLocaleString()}
                                    </span>
                                </div>
                                <pre style={{
                                    background: 'var(--background-color)',
                                    padding: '0.5rem',
                                    borderRadius: '4px',
                                    whiteSpace: 'pre-wrap',
                                    maxHeight: '100px',
                                    overflowY: 'auto',
                                    fontSize: '0.875rem'
                                }}>
                                    {prompt.text}
                                </pre>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    <button className="btn btn-secondary" onClick={() => handleCopy(prompt.text)} title={t('copy')}>
                                        <Copy size={16} />
                                    </button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(prompt.id)} title={t('delete')}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <p style={{ margin: 0 }}>
                        💾 <strong>{t('data_storage_title') || "Data Storage"}:</strong> {t('saved_prompts_privacy') || "Your prompts are stored locally in your browser. Clearing your cache will remove them."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SavedPromptsModal;
