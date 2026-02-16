export const generatePrompt = (method, formState, config, t) => {
    let promptParts = [];

    config.forEach(section => {
        let sectionContent = "";
        
        // Helper to get textarea value
        const getTextareaValue = (id) => formState[id] || "";

        // Determine if section should be included
        // Heuristic: If it has fields, check if important fields have data
        // For now, we mainly look at the target textarea of the section
        // In the config, usually the last field is the specific textarea or the one receiving data
        
        // We can iterate over fields to find the textarea
        const textareaField = section.fields.find(f => f.type === 'textarea');
        if (textareaField) {
            sectionContent = getTextareaValue(textareaField.id);
        }

        if (sectionContent && sectionContent.trim() !== "") {
            const sectionTitle = t(section.labelKey).toUpperCase();
            promptParts.push(`### ${sectionTitle} ###\n${sectionContent.trim()}`);
        }
    });

    let finalPrompt = promptParts.join("\n\n");

    // CoT
    if (formState[`cot-${method}`]) {
        // Use a specific key for the instruction text, or fallback to default
        const instruction = t('step_by_step_instruction', "Pense étape par étape avant de répondre."); 
        finalPrompt += `\n\n### INSTRUCTION ###\n${instruction}`;
    }

    return finalPrompt;
};
