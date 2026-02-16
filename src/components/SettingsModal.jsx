import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, X, RefreshCw } from 'lucide-react';
import { getOllamaModels } from '../services/aiService';

const SettingsModal = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({
        provider: 'ollama',
        ollamaUrl: 'http://localhost:11434',
        ollamaModel: 'llama3',
        openaiKey: '',
        openaiModel: 'gpt-3.5-turbo',
        geminiKey: '',
        geminiModel: 'gemini-pro',
        temperature: 0.7
    });
    const [ollamaModels, setOllamaModels] = useState([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const savedSettings = localStorage.getItem('aiSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings));
            }
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        localStorage.setItem('aiSettings', JSON.stringify(settings));
        onClose();
    };

    const fetchOllamaModels = async () => {
        setIsLoadingModels(true);
        const models = await getOllamaModels(settings);
        setOllamaModels(models);
        setIsLoadingModels(false);
        if (models.length > 0 && !models.includes(settings.ollamaModel)) {
             setSettings(prev => ({...prev, ollamaModel: models[0]}));
        }
    };
    
    // Auto-fetch on open if provider is ollama
    useEffect(() => {
        if (isOpen && settings.provider === 'ollama' && ollamaModels.length === 0) {
             fetchOllamaModels();
        }
    }, [isOpen, settings.provider]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                    <h2>{t('settings_title') || "Settings"}</h2>
                    <button className="btn btn-secondary" onClick={onClose} style={{ padding: '0.5rem' }}>
                        <X size={20} />
                    </button>
                </div>

                <div className="form-group">
                    <label>{t('ai_provider') || "AI Provider"}</label>
                    <select
                        name="provider"
                        value={settings.provider}
                        onChange={handleChange}
                    >
                        <option value="ollama">Ollama (Local)</option>
                        <option value="openai">OpenAI</option>
                        <option value="gemini">Google Gemini</option>
                    </select>
                </div>

                {settings.provider === 'ollama' && (
                    <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
                        <h4>{t('ollama_config')}</h4>
                        <div className="form-group">
                            <label>{t('base_url')}</label>
                            <input
                                type="text"
                                name="ollamaUrl"
                                value={settings.ollamaUrl}
                                onChange={handleChange}
                                placeholder="http://localhost:11434"
                            />
                        </div>
                        <div className="form-group">
                            <label style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                                {t('model_name')}
                                <button type="button" onClick={fetchOllamaModels} className="btn btn-sm btn-secondary" disabled={isLoadingModels}>
                                    <RefreshCw size={14} className={isLoadingModels ? "animate-spin" : ""} /> {t('fetch_models')}
                                </button>
                            </label>
                            {ollamaModels.length > 0 ? (
                                <select name="ollamaModel" value={settings.ollamaModel} onChange={handleChange}>
                                    {ollamaModels.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="ollamaModel"
                                    value={settings.ollamaModel}
                                    onChange={handleChange}
                                    placeholder="llama3, mistral, etc."
                                />
                            )}
                        </div>
                    </div>
                )}

                {settings.provider === 'openai' && (
                    <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
                        <h4>OpenAI Configuration</h4>
                        <div className="form-group">
                            <label>API Key</label>
                            <input
                                type="password"
                                name="openaiKey"
                                value={settings.openaiKey}
                                onChange={handleChange}
                                placeholder="sk-..."
                            />
                        </div>
                        <div className="form-group">
                            <label>Model</label>
                            <input
                                type="text"
                                name="openaiModel"
                                value={settings.openaiModel}
                                onChange={handleChange}
                                placeholder="gpt-3.5-turbo, gpt-4"
                            />
                        </div>
                    </div>
                )}

                {settings.provider === 'gemini' && (
                    <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
                        <h4>{t('gemini_config') || "Google Gemini Configuration"}</h4>
                        <div className="form-group">
                            <label>{t('api_key')}</label>
                            <input
                                type="password"
                                name="geminiKey"
                                value={settings.geminiKey}
                                onChange={handleChange}
                                placeholder="AIza..."
                            />
                        </div>
                        <div className="form-group">
                            <label>{t('model_name')}</label>
                            <input
                                type="text"
                                name="geminiModel"
                                value={settings.geminiModel}
                                onChange={handleChange}
                                placeholder="gemini-pro"
                            />
                        </div>
                    </div>
                )}
                
                <div className="form-group" style={{marginTop: '1rem'}}>
                    <label style={{display:'flex', justifyContent:'space-between'}}>
                        {t('temperature')} 
                        <span style={{color:'var(--primary-color)'}}>{settings.temperature}</span>
                    </label>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        name="temperature" 
                        value={settings.temperature} 
                        onChange={handleChange} 
                        style={{width: '100%'}}
                    />
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text-secondary)'}}>
                        <span>Précis (0.0)</span>
                        <span>Créatif (1.0)</span>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={onClose}>
                        {t('cancel') || "Cancel"}
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        <Save size={18} />
                        {t('save') || "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
