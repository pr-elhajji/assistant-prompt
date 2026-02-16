import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, X, RefreshCw } from 'lucide-react';
import { getOllamaModels, getOpenAIModels, getGeminiModels, getOpenRouterModels } from '../services/aiService';

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
        openRouterKey: '',
        openRouterModel: 'openai/gpt-3.5-turbo',
        temperature: 0.7
    });
    const [ollamaModels, setOllamaModels] = useState([]);
    const [openaiModels, setOpenaiModels] = useState([]);
    const [geminiModels, setGeminiModels] = useState([]);
    const [openRouterModels, setOpenRouterModels] = useState([]);
    const [isLoadingModels, setIsLoadingModels] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const savedSettings = localStorage.getItem('aiSettings');
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings)); // eslint-disable-line
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

    const fetchOllamaModels = React.useCallback(async () => {
        setIsLoadingModels(true);
        const models = await getOllamaModels(settings);
        setOllamaModels(models);
        setIsLoadingModels(false);
        if (models.length > 0 && !models.includes(settings.ollamaModel)) {
            setSettings(prev => ({ ...prev, ollamaModel: models[0] }));
        }
    }, [settings]);

    const fetchOpenAIModels = React.useCallback(async () => {
        setIsLoadingModels(true);
        const models = await getOpenAIModels(settings.openaiKey);
        setOpenaiModels(models);
        setIsLoadingModels(false);
        if (models.length > 0 && !models.includes(settings.openaiModel)) {
            setSettings(prev => ({ ...prev, openaiModel: models[0] }));
        }
    }, [settings.openaiKey, settings.openaiModel]);

    const fetchGeminiModels = React.useCallback(async () => {
        setIsLoadingModels(true);
        const models = await getGeminiModels(settings.geminiKey);
        setGeminiModels(models);
        setIsLoadingModels(false);
        if (models.length > 0 && !models.includes(settings.geminiModel)) {
            setSettings(prev => ({ ...prev, geminiModel: models[0] }));
        }
    }, [settings.geminiKey, settings.geminiModel]);

    const fetchOpenRouterModels = React.useCallback(async () => {
        setIsLoadingModels(true);
        const models = await getOpenRouterModels(settings.openRouterKey);
        setOpenRouterModels(models);
        setIsLoadingModels(false);
        if (models.length > 0 && !models.includes(settings.openRouterModel)) {
            setSettings(prev => ({ ...prev, openRouterModel: models[0] })); // Default to first if not set
        }
    }, [settings.openRouterKey, settings.openRouterModel]);

    // Auto-fetch on open if provider is ollama
    useEffect(() => {
        if (isOpen && settings.provider === 'ollama' && ollamaModels.length === 0) {
            fetchOllamaModels(); // eslint-disable-line
        }
    }, [isOpen, settings.provider, ollamaModels.length, fetchOllamaModels]);

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
                        <option value="openrouter">OpenRouter</option>
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
                            <small style={{ display: 'block', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                ⚠️ {t('ollama_cors_warning') || "For local Ollama, ensure CORS is enabled:"} <br />
                                <code>OLLAMA_ORIGINS="*" ollama serve</code>
                            </small>
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {t('model_name') || "Model"}
                                <button type="button" onClick={fetchOpenAIModels} className="btn btn-sm btn-secondary" disabled={isLoadingModels || !settings.openaiKey}>
                                    <RefreshCw size={14} className={isLoadingModels ? "animate-spin" : ""} /> {t('fetch_models')}
                                </button>
                            </label>
                            {openaiModels.length > 0 ? (
                                <select name="openaiModel" value={settings.openaiModel} onChange={handleChange}>
                                    {openaiModels.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="openaiModel"
                                    value={settings.openaiModel}
                                    onChange={handleChange}
                                    placeholder="gpt-3.5-turbo, gpt-4"
                                />
                            )}
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
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {t('model_name')}
                                <button type="button" onClick={fetchGeminiModels} className="btn btn-sm btn-secondary" disabled={isLoadingModels || !settings.geminiKey}>
                                    <RefreshCw size={14} className={isLoadingModels ? "animate-spin" : ""} /> {t('fetch_models')}
                                </button>
                            </label>
                            {geminiModels.length > 0 ? (
                                <select name="geminiModel" value={settings.geminiModel} onChange={handleChange}>
                                    {geminiModels.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="geminiModel"
                                    value={settings.geminiModel}
                                    onChange={handleChange}
                                    placeholder="gemini-pro"
                                />
                            )}
                        </div>
                    </div>
                )}

                {settings.provider === 'openrouter' && (
                    <div className="card" style={{ padding: '1rem', marginTop: '1rem' }}>
                        <h4>{t('openrouter_config') || "OpenRouter Configuration"}</h4>
                        <div className="form-group">
                            <label>{t('api_key')}</label>
                            <input
                                type="password"
                                name="openRouterKey"
                                value={settings.openRouterKey}
                                onChange={handleChange}
                                placeholder="sk-or-..."
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {t('model_name')}
                                <button type="button" onClick={fetchOpenRouterModels} className="btn btn-sm btn-secondary" disabled={isLoadingModels || !settings.openRouterKey}>
                                    <RefreshCw size={14} className={isLoadingModels ? "animate-spin" : ""} /> {t('fetch_models')}
                                </button>
                            </label>
                            {openRouterModels.length > 0 ? (
                                <select name="openRouterModel" value={settings.openRouterModel} onChange={handleChange}>
                                    {openRouterModels.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="openRouterModel"
                                    value={settings.openRouterModel}
                                    onChange={handleChange}
                                    placeholder="openai/gpt-3.5-turbo, anthropic/claude-3-haiku"
                                />
                            )}
                        </div>
                    </div>
                )}

                <div className="form-group" style={{ marginTop: '1rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {t('temperature')}
                        <span style={{ color: 'var(--primary-color)' }}>{settings.temperature}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        name="temperature"
                        value={settings.temperature}
                        onChange={handleChange}
                        style={{ width: '100%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        <span>Précis (0.0)</span>
                        <span>Créatif (1.0)</span>
                    </div>
                </div>

                <div style={{ marginTop: '1.5rem', padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <p style={{ margin: 0 }}>
                        🔒 <strong>{t('privacy_title') || "Privacy Note"}:</strong> {t('privacy_content') || "Your API keys and settings are stored locally on your device (localStorage). They are never sent to our servers."}
                    </p>
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
