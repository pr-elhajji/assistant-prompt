import React, { useState, useEffect } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { generatePrompt } from '../utils/promptGenerator';
import { formConfig } from '../config/methods';
import { Loader2, Sparkles } from 'lucide-react';
import { generateText } from '../services/aiService';

const DynamicForm = ({ method, markdownData, onGenerate }) => {
    const { t } = useTranslation();
    const [formState, setFormState] = useState({});
    const [customRoles, setCustomRoles] = useState([]);
    const [customContexts, setCustomContexts] = useState([]);
    const [showCustomRoleInput, setShowCustomRoleInput] = useState(false);
    const [showCustomContextInput, setShowCustomContextInput] = useState(false);
    const [newRole, setNewRole] = useState("");
    const [newContext, setNewContext] = useState("");
    const [aiLoading, setAiLoading] = useState({});

    // Load custom items from localStorage
    useEffect(() => {
        const savedRoles = localStorage.getItem('customRoles');
        if (savedRoles) setCustomRoles(JSON.parse(savedRoles));

        const savedContexts = localStorage.getItem('customContexts');
        if (savedContexts) setCustomContexts(JSON.parse(savedContexts));
    }, []);

    // Reset state on method change
    useEffect(() => {
        setFormState({});
        setShowCustomRoleInput(false);
        setShowCustomContextInput(false);
    }, [method]);

    const config = formConfig[method];

    if (!config) return <div>Configuration not found for method {method}</div>;

    const handleSelect1Change = (e, select1Id, select2Id, targetAreaId, message1Key) => {
        const val = e.target.value;

        if (val === "custom_role_option") {
            setShowCustomRoleInput(true);
            setShowCustomContextInput(false);
            return;
        } else if (val === "custom_context_option") {
            setShowCustomContextInput(true);
            setShowCustomRoleInput(false);
            return;
        } else {
            setShowCustomRoleInput(false);
            setShowCustomContextInput(false);
        }

        // Check if secondary options exist for this value
        const val1 = val;
        // Need to check mapped options. markdownData[val1] might be undefined for custom/leaf roles.
        const options2List = val1 && markdownData[val1] ? markdownData[val1] : [];

        let newTargetText = "";

        // If no secondary options, generate text immediately (Leaf Node)
        if (options2List.length === 0 && val1 && val1 !== "0") {
            const msg1 = getMarkdownMessage(message1Key);
            // Standard format: Message + " " + value + "."
            newTargetText = `${msg1} ${val1.toLowerCase()}.`;
        }

        // Reset Select 2 and update state
        setFormState(prev => ({
            ...prev,
            [select1Id]: val,
            [select2Id]: "", // Reset secondary select
            [targetAreaId]: newTargetText // Set text if leaf, otherwise empty
        }));
    };

    const handleAddCustomRole = (select1Id, select2Id, targetAreaId, message1Key) => {
        if (!newRole.trim()) return;

        const roleName = newRole.trim();
        const updatedRoles = [...customRoles, roleName].sort();
        setCustomRoles(updatedRoles);
        localStorage.setItem('customRoles', JSON.stringify(updatedRoles));

        // Generate text for custom role (Leaf node)
        const msg1 = getMarkdownMessage(message1Key);
        const text = `${msg1} ${roleName.toLowerCase()}.`;

        // Set the new role as selected
        setFormState(prev => ({
            ...prev,
            [select1Id]: roleName,
            [select2Id]: "",
            [targetAreaId]: text
        }));

        setNewRole("");
        setShowCustomRoleInput(false);
    };

    const handleAddCustomContext = (select1Id, select2Id, targetAreaId, message1Key) => {
        if (!newContext.trim()) return;

        const contextName = newContext.trim();
        const updatedContexts = [...customContexts, contextName].sort();
        setCustomContexts(updatedContexts);
        localStorage.setItem('customContexts', JSON.stringify(updatedContexts));

        // Generate text for custom context (Leaf node)
        const msg1 = getMarkdownMessage(message1Key);
        const text = `${msg1} ${contextName.toLowerCase()}.`;

        setFormState(prev => ({
            ...prev,
            [select1Id]: contextName,
            [select2Id]: "",
            [targetAreaId]: text
        }));

        setNewContext("");
        setShowCustomContextInput(false);
    };

    const handleSelect2Change = (e, select1Id, select2Id, targetAreaId, message1Key, message2Key) => {
        const val2 = e.target.value;
        const val1 = formState[select1Id];

        if (!val1 || val1 === "0" || !val2 || val2 === "0") {
            setFormState(prev => ({ ...prev, [select2Id]: val2, [targetAreaId]: "" }));
            return;
        }

        // Message construction logic from legacy script
        // message1 + " " + select1.toLowerCase() + " " + select2.toLowerCase() + " " + message2 + "."
        const msg1 = getMarkdownMessage(message1Key);
        const msg2 = getMarkdownMessage(message2Key);

        const text = `${msg1} ${val1.toLowerCase()} ${val2.toLowerCase()} ${msg2}.`;

        setFormState(prev => ({
            ...prev,
            [select2Id]: val2,
            [targetAreaId]: text
        }));
    };

    const handleSingleSelectChange = (e, selectId, targetAreaId, messageKey) => {
        const val = e.target.value;
        if (!val || val === "0") {
            setFormState(prev => ({ ...prev, [selectId]: val, [targetAreaId]: "" }));
            return;
        }

        const msg = getMarkdownMessage(messageKey);
        // Legacy: doc.getElementById(id_area).value = message + " " + select1.toLowerCase() + ".";
        // Special handling for EBEP: append instead of replace?
        // Legacy script: if id_select == tabSelect+"-ebep ... append
        // My config marks ebep with a specific condition.

        const isEbep = selectId.includes('ebep');
        const currentText = formState[targetAreaId] || "";

        let newText = `${msg} ${val.toLowerCase()}.`;
        if (isEbep) {
            newText = currentText + " " + newText;
        }

        setFormState(prev => ({
            ...prev,
            [selectId]: val,
            [targetAreaId]: newText
        }));
    }

    const getMarkdownMessage = (key) => {
        // Look up in markdownData['Message-' + key]
        // The key passed from config might be 'rct-metier1'
        // In data.md it is '# Message-rct-metier1' -> content
        const msgList = markdownData[`Message-${key}`];
        return msgList && msgList.length > 0 ? msgList[0] : "";
    };

    const handleTextareaChange = (e, id) => {
        const val = e.target.value;
        setFormState(prev => ({ ...prev, [id]: val }));
    };

    const handleCoTChange = (e) => {
        const checked = e.target.checked;
        setFormState(prev => ({ ...prev, [`cot-${method}`]: checked }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const prompt = generatePrompt(method, formState, config, t);
        onGenerate(prompt);
    };

    const handleReset = () => {
        setFormState({});
    };

    const handleAIHelp = async (fieldId) => {
        setAiLoading(prev => ({ ...prev, [fieldId]: true }));

        try {
            const currentText = formState[fieldId] || "";
            // Context from other fields to help the AI
            const contextData = JSON.stringify(formState);

            const prompt = `Task: Complete or improve the content for the field '${fieldId}' in a form for the '${method}' pedagogical method.
            Current value: "${currentText}"
            Context of other fields: ${contextData}
            
            Provide only the text to be added or the improved version, without conversational filler.`;

            const aiResponse = await generateText(prompt);

            setFormState(prev => ({
                ...prev,
                [fieldId]: aiResponse
            }));
        } catch (error) {
            console.error(error);
            let errorMessage = error.message;

            if (errorMessage.includes("Failed to fetch") || errorMessage.includes("NetworkError")) {
                alert(
                    `${t('ai_error')}: ${errorMessage}\n\n` +
                    `⚠️ ${t('ollama_cors_help') || "Possible CORS Issue with Ollama"}\n` +
                    `Run: OLLAMA_ORIGINS="*" ollama serve`
                );
            } else if (errorMessage.includes("No models provided") || errorMessage.includes("Model is missing")) {
                alert(
                    `${t('ai_error')}: ${errorMessage}\n\n` +
                    `⚠️ ${t('configure_model_help') || "Please go to Settings and select a Model for the chosen Provider."}`
                );
            } else if (errorMessage.includes("credits") || errorMessage.includes("afford")) {
                alert(
                    `${t('ai_error')}: ${errorMessage}\n\n` +
                    `⚠️ OpenRouter Error: Insufficient credits or max_tokens too high.\n` +
                    `We have capped max_tokens to 4000 to help with this. If you still see this, check your OpenRouter credits.`
                );
            } else {
                alert(t('ai_error') || "AI Generation Failed: " + errorMessage);
            }
        } finally {
            setAiLoading(prev => ({ ...prev, [fieldId]: false }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="card">
                <h3><Trans i18nKey="preamble" /> {method}</h3>
            </div>

            {config.map((section, idx) => (
                <div key={section.id} className="card form-section">
                    <h4>{idx + 1}. {t(section.labelKey)} <span style={{ color: 'var(--primary-color)' }}>{section.labelKey.charAt(0).toUpperCase()}</span></h4>
                    <hr style={{ borderColor: 'var(--border-color)', marginBottom: '1rem' }} />

                    {section.fields.map((field, fIdx) => {
                        if (field.type === 'select_group') {
                            // Map ID to Category
                            const category1 = getCategoryForId(field.select1);
                            let options1List = markdownData[category1] || [];

                            // Append custom items based on category
                            if (category1 === 'Roles') {
                                options1List = [...options1List, ...customRoles];
                            } else if (category1 === 'Contexts') {
                                options1List = [...options1List, ...customContexts];
                            }

                            // Category 2 depends on selection 1.
                            const val1 = formState[field.select1];
                            const options2List = val1 && markdownData[val1] ? markdownData[val1] : [];

                            return (
                                <div className="form-row" key={fIdx}>
                                    <div style={{ width: '35%', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                        <select
                                            value={formState[field.select1] || "0"}
                                            onChange={(e) => handleSelect1Change(e, field.select1, field.select2, field.target, field.select1)}
                                            style={{ width: '100%' }}
                                        >
                                            <option value="0">{t('select')}</option>
                                            {options1List.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            {category1 === 'Roles' && <option value="custom_role_option">-- {t('add_custom_role') || "Autre / Nouveau..."} --</option>}
                                            {category1 === 'Contexts' && <option value="custom_context_option">-- {t('add_custom_context') || "Autre / Nouveau..."} --</option>}
                                        </select>

                                        {showCustomRoleInput && category1 === 'Roles' && (
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <input
                                                    type="text"
                                                    value={newRole}
                                                    onChange={(e) => setNewRole(e.target.value)}
                                                    placeholder="Nouveau rôle..."
                                                    className="form-control"
                                                    style={{ fontSize: '0.9rem', padding: '4px' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleAddCustomRole(field.select1, field.select2, field.target, field.select1)}
                                                >
                                                    OK
                                                </button>
                                            </div>
                                        )}

                                        {showCustomContextInput && category1 === 'Contexts' && (
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <input
                                                    type="text"
                                                    value={newContext}
                                                    onChange={(e) => setNewContext(e.target.value)}
                                                    placeholder="Nouveau contexte..."
                                                    className="form-control"
                                                    style={{ fontSize: '0.9rem', padding: '4px' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleAddCustomContext(field.select1, field.select2, field.target, field.select1)}
                                                >
                                                    OK
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {options2List.length > 0 && (
                                        <select
                                            value={formState[field.select2] || "0"}
                                            disabled={!val1 || val1 === "0"}
                                            onChange={(e) => handleSelect2Change(e, field.select1, field.select2, field.target, field.select1, field.select2)}
                                            style={{ width: '45%' }}
                                        >
                                            <option value="0">{t('select')}</option>
                                            {options2List.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    )}
                                </div>
                            );
                        }

                        if (field.type === 'select_single') {
                            // Check condition (e.g. ebep only if student)
                            if (field.condition === 'student') {
                                // Check if any role selector has "Élève" selected.
                                // This is tricky as we need to find the role field.
                                // Hardcode check: formState['rct-metier1'] === 'Élève' ?
                                // Or generically.
                                // For RCT, rct-metier1.
                                // const role1 = formState[`${method.toLowerCase()}-metier1`] ...
                                // Better: loop over state keys? 

                                // Let's assume for RCT/CONTEXTE-V we know the key.
                                // For RCT: rct-metier1. For Context-V: contexte-v-niveau1?
                                // Actually CONTEXTE-V ebep logic is not in the formConfig I wrote?
                                // Wait, I see 'rct-ebep' in RCT config.
                                // Logic: if (select1 == "Élève") show ebep.

                                const roleKey = getRoleKeyForMethod(method);
                                if (formState[roleKey] !== 'Élève') return null;
                            }

                            const category = getCategoryForId(field.id);
                            const options = markdownData[category] || [];
                            return (
                                <div className="form-group" key={fIdx}>
                                    {field.condition === 'student' && <b>L'élève a un besoin particulier, il est...</b>}
                                    <select
                                        value={formState[field.id] || "0"}
                                        onChange={(e) => handleSingleSelectChange(e, field.id, field.target, field.id)}
                                    >
                                        <option value="0">{t('select')}</option>
                                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            )
                        }

                        if (field.type === 'textarea') {
                            const isAiLoading = aiLoading[field.id];
                            return (
                                <div className="form-group" key={fIdx}>
                                    <div className="input-wrapper">
                                        <textarea
                                            id={field.id}
                                            value={formState[field.id] || ""}
                                            placeholder={t(field.placeholderKey) || field.placeholderKey}
                                            onChange={(e) => handleTextareaChange(e, field.id)}
                                        />
                                        <button
                                            type="button"
                                            className="ai-assist-btn"
                                            onClick={() => handleAIHelp(field.id)}
                                            title={t('ai_assist_title') || "AI Assistant"}
                                            disabled={isAiLoading}
                                        >
                                            {isAiLoading ? <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> : <Sparkles size={16} />}
                                        </button>
                                    </div>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            ))}

            <div className="card">
                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id={`cot-${method}`}
                        checked={formState[`cot-${method}`] || false}
                        onChange={handleCoTChange}
                    />
                    <label htmlFor={`cot-${method}`}>{t('step_by_step')}</label>
                </div>

                <div className="btn-group">
                    <button type="button" className="btn btn-danger" onClick={handleReset}>
                        {t('clear')}
                    </button>
                    <button type="submit" className="btn btn-primary">
                        {t('validate')}
                    </button>
                </div>
            </div>
        </form>
    );
};

// Helper to map ID to Data Category
const getCategoryForId = (id) => {
    // Map based on partial ID matches or lookup table
    const map = {
        'rct-metier1': 'Roles',
        'rct-contexte1': 'Contexts',
        'rct-ebep': 'RCTebep',
        'rtf-role1': 'Roles',
        'rtf-format': 'ACTIFformat',
        'craft-role1': 'Roles',
        'craft-format': 'ACTIFformat',
        'craft-tonalite': 'ACTIFtonalite',
        'contexte-v-niveau1': 'Roles',
        'contexte-v-tonalite': 'ACTIFtonalite',
        'contexte-v-encodage': 'ACTIFformat',
        'images-intention': '', // No selects for images
        'rctp2f2r-metier1': 'RCTP2F2Rrole',
        'rctp2f2r-contexte1': 'Contexts'
    };
    // Normalize id
    return map[id] || id; // Fallback to ID if no map (might fail if not exact match)
}

const getRoleKeyForMethod = (method) => {
    switch (method) {
        case 'RCT': return 'rct-metier1';
        case 'CONTEXTE-V': return 'contexte-v-niveau1';
        // Add others if EBEP applies
        default: return 'rct-metier1';
    }
}

export default DynamicForm;
