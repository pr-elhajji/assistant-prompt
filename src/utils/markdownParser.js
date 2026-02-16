/**
 * Parses the markdown content from data.md
 * @param {string} text - The raw markdown text
 * @returns {object} - { params: object, data: object, warnings: array }
 */
export const parseMarkdown = (text) => {
    const params = {};
    const data = {};
    const warnings = [];

    // 1. Extract Parameters (--DEBUT-- ... ---FIN---)
    const paramBlockRegex = /^--DEBUT--\s*\n([\s\S]*?)\n---FIN---/m;
    const paramMatch = text.match(paramBlockRegex);

    if (paramMatch) {
        const lines = paramMatch[1].split('\n');
        lines.forEach(line => {
            const [key, value] = line.split(':').map(s => s.trim());
            if (key && value !== undefined) {
                params[key] = value.toLowerCase() === 'true';
            }
        });
    }

    // 2. Parse Categories (# Title -> Items)
    const lines = text.split('\n');
    let currentCategory = null;

    lines.forEach(line => {
        line = line.trim();
        
        // Ignore comments and param block
        if (line.startsWith('<!--') || line.startsWith('--DEBUT--') || line.startsWith('---FIN---')) {
            return;
        }

        if (line.startsWith('# ')) {
            currentCategory = line.substring(2).trim();
            data[currentCategory] = [];
        } else if (currentCategory && line) {
            data[currentCategory].push(line);
        }
    });



    return { params, data, warnings };
};

/**
 * Fetches and parses the data.md file
 * @returns {Promise<object>}
 */
export const fetchAndParseData = async () => {
    try {
        const response = await fetch('/data/data.md');
        if (!response.ok) throw new Error('Failed to fetch data.md');
        const text = await response.text();
        return parseMarkdown(text);
    } catch (error) {
        console.error("Error loading data:", error);
        return { params: {}, data: {}, warnings: [error.message] };
    }
};
