
/**
 * Service to handle AI API calls
 */

const getSettings = () => {
    return JSON.parse(localStorage.getItem('aiSettings') || '{"provider": "ollama", "ollamaUrl": "http://localhost:11434", "ollamaModel": "llama3", "openaiKey": "", "openaiModel": "gpt-3.5-turbo", "geminiKey": "", "geminiModel": "gemini-pro", "openRouterKey": "", "openRouterModel": "openai/gpt-3.5-turbo", "temperature": 0.7}');
};

export const getOllamaModels = async (settings) => {
    try {
        const response = await fetch(`${settings.ollamaUrl}/api/tags`);
        if (!response.ok) throw new Error("Failed to fetch models");
        const data = await response.json();
        return data.models.map(m => m.name);
    } catch (error) {
        console.error("Error fetching Ollama models:", error);
        return [];
    }
};

export const getOpenAIModels = async (apiKey) => {
    if (!apiKey) return [];
    try {
        const response = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });
        if (!response.ok) throw new Error("Failed to fetch OpenAI models");
        const data = await response.json();
        return data.data.map(m => m.id).sort();
    } catch (error) {
        console.error("Error fetching OpenAI models:", error);
        return [];
    }
};

export const getGeminiModels = async (apiKey) => {
    if (!apiKey) return [];
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        if (!response.ok) throw new Error("Failed to fetch Gemini models");
        const data = await response.json();
        return data.models.map(m => m.name.replace('models/', '')).sort();
    } catch (error) {
        console.error("Error fetching Gemini models:", error);
        return [];
    }
};

export const getOpenRouterModels = async (apiKey) => {
    if (!apiKey) return [];
    try {
        const response = await fetch('https://openrouter.ai/api/v1/models');
        if (!response.ok) throw new Error("Failed to fetch OpenRouter models");
        const data = await response.json();
        return data.data.map(m => m.id).sort();
    } catch (error) {
        console.error("Error fetching OpenRouter models:", error);
        return [];
    }
};

export const generateText = async (prompt, context = "") => {
    const settings = getSettings();
    const fullPrompt = context ? `${context}\n\nTask: ${prompt}` : prompt; // Simple prompt construction

    try {
        switch (settings.provider) {
            case 'ollama':
                return await callOllama(settings, fullPrompt);
            case 'openai':
                return await callOpenAI(settings, fullPrompt);
            case 'openrouter':
                return await callOpenRouter(settings, fullPrompt);
            case 'gemini':
                return await callGemini(settings, fullPrompt);
            default:
                throw new Error("Unknown provider");
        }
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
};

const callOllama = async (settings, prompt) => {
    const response = await fetch(`${settings.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: settings.ollamaModel,
            prompt: prompt,
            stream: false,
            options: {
                temperature: parseFloat(settings.temperature || 0.7)
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Ollama Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
};

const callOpenAI = async (settings, prompt) => {
    if (!settings.openaiKey) throw new Error("OpenAI API Key is missing");

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.openaiKey}`
        },
        body: JSON.stringify({
            model: settings.openaiModel,
            messages: [{ role: "user", content: prompt }],
            temperature: parseFloat(settings.temperature || 0.7)
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`OpenAI Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
};

const callGemini = async (settings, prompt) => {
    if (!settings.geminiKey) throw new Error("Gemini API Key is missing");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${settings.geminiModel}:generateContent?key=${settings.geminiKey}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: parseFloat(settings.temperature || 0.7)
            }
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`Gemini Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
};

const callOpenRouter = async (settings, prompt) => {
    if (!settings.openRouterKey) throw new Error("OpenRouter API Key is missing");
    if (!settings.openRouterModel) throw new Error("OpenRouter Model is missing. Please select a model in Settings.");

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${settings.openRouterKey}`,
            'HTTP-Referer': window.location.href, // Required by OpenRouter for rankings
            'X-Title': 'Assistant Prompt' // Optional
        },
        body: JSON.stringify({
            model: settings.openRouterModel,
            messages: [{ role: "user", content: prompt }],
            temperature: parseFloat(settings.temperature || 0.7)
        })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(`OpenRouter Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
};
