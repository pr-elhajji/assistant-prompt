export const formConfig = {
    RCT: [
        {
            id: 'rct-role',
            labelKey: 'role',
            fields: [
                { type: 'select_group', select1: 'rct-metier1', select2: 'rct-metier2', target: 'area_rct-role' },
                { type: 'textarea', id: 'area_rct-role', placeholderKey: 'role' }
            ]
        },
        {
            id: 'rct-contexte',
            labelKey: 'context',
            fields: [
                { type: 'select_group', select1: 'rct-contexte1', select2: 'rct-contexte2', target: 'area_rct-contexte' },
                { type: 'textarea', id: 'area_rct-contexte', placeholderKey: 'context' },
                { type: 'select_single', id: 'rct-ebep', target: 'area_rct-contexte', labelKey: 'ebep', condition: 'student' }
            ]
        },
        {
            id: 'rct-tache',
            labelKey: 'task',
            fields: [
                { type: 'textarea', id: 'area_rct-tache', placeholderKey: 'task' }
            ]
        }
    ],
    RTF: [
        {
            id: 'rtf-role',
            labelKey: 'role',
            fields: [
                { type: 'select_group', select1: 'rtf-role1', select2: 'rtf-role2', target: 'area_rtf-role' },
                { type: 'textarea', id: 'area_rtf-role', placeholderKey: 'role' }
            ]
        },
        {
            id: 'rtf-tache',
            labelKey: 'task',
            fields: [
                { type: 'textarea', id: 'area_rtf-tache', placeholderKey: 'task' }
            ]
        },
        {
            id: 'rtf-format',
            labelKey: 'format',
            fields: [
               { type: 'select_single', id: 'rtf-format', target: 'area_rtf-format' },
               { type: 'textarea', id: 'area_rtf-format', placeholderKey: 'format' }
            ]
        }
    ],
    CRAFT: [
        { id: 'craft-context', labelKey: 'context', fields: [{ type: 'textarea', id: 'area_craft-context', placeholderKey: 'context' }] },
        {
            id: 'craft-role', labelKey: 'role',
            fields: [
                { type: 'select_group', select1: 'craft-role1', select2: 'craft-role2', target: 'area_craft-role' },
                { type: 'textarea', id: 'area_craft-role', placeholderKey: 'role' }
            ]
        },
        { id: 'craft-action', labelKey: 'action', fields: [{ type: 'textarea', id: 'area_craft-action', placeholderKey: 'action' }] },
        { 
            id: 'craft-format', labelKey: 'format',
            fields: [
                { type: 'select_single', id: 'craft-format', target: 'area_craft-format' },
                { type: 'textarea', id: 'area_craft-format', placeholderKey: 'format' }
            ]
        },
        {
             id: 'craft-tone', labelKey: 'tone',
             fields: [
                 { type: 'select_single', id: 'craft-tonalite', target: 'area_craft-tonalite' },
                 { type: 'textarea', id: 'area_craft-tonalite', placeholderKey: 'tone' }
             ]
        }
    ],
    'CONTEXTE-V': [
        { id: 'contexte-v-contexte', labelKey: 'context', fields: [{ type: 'textarea', id: 'area_contexte-v-contexte', placeholderKey: 'context' }] },
        { id: 'contexte-v-objectif', labelKey: 'objective', fields: [{ type: 'textarea', id: 'area_contexte-v-objectif', placeholderKey: 'objective' }] },
        {
            id: 'contexte-v-niveau', labelKey: 'level',
            fields: [
                { type: 'select_group', select1: 'contexte-v-niveau1', select2: 'contexte-v-niveau2', target: 'area_contexte-v-niveau' },
                { type: 'textarea', id: 'area_contexte-v-niveau', placeholderKey: 'level' }
            ]
        },
        { id: 'contexte-v-tache', labelKey: 'task', fields: [{ type: 'textarea', id: 'area_contexte-v-tache', placeholderKey: 'task' }] },
        { id: 'contexte-v-exemples', labelKey: 'examples', fields: [{ type: 'textarea', id: 'area_contexte-v-exemples', placeholderKey: 'examples' }] },
        { id: 'contexte-v-xcontraintes', labelKey: 'constraints', fields: [{ type: 'textarea', id: 'area_contexte-v-xcontraintes', placeholderKey: 'constraints' }] },
        {
            id: 'contexte-v-tonalite', labelKey: 'tone',
            fields: [
                { type: 'select_single', id: 'contexte-v-tonalite', target: 'area_contexte-v-tonalite' },
                { type: 'textarea', id: 'area_contexte-v-tonalite', placeholderKey: 'tone' }
            ]
        },
        {
            id: 'contexte-v-encodage', labelKey: 'encoding',
            fields: [
                { type: 'select_single', id: 'contexte-v-encodage', target: 'area_contexte-v-encodage' },
                { type: 'textarea', id: 'area_contexte-v-encodage', placeholderKey: 'encoding' }
            ]
        },
        { id: 'contexte-v-verification', labelKey: 'verification', fields: [{ type: 'textarea', id: 'area_contexte-v-verification', placeholderKey: 'verification' }] }
    ],
    IMAGES: [
         { id: 'images-intention', labelKey: 'intent', fields: [{ type: 'textarea', id: 'area_images-intention', placeholderKey: 'intent' }] },
         { id: 'images-motif', labelKey: 'motif', fields: [{ type: 'textarea', id: 'area_images-motif', placeholderKey: 'motif' }] },
         { id: 'images-ambiance', labelKey: 'ambiance', fields: [{ type: 'textarea', id: 'area_images-ambiance', placeholderKey: 'ambiance' }] },
         { id: 'images-grain', labelKey: 'grain', fields: [{ type: 'textarea', id: 'area_images-grain', placeholderKey: 'grain' }] },
         { id: 'images-esthetique', labelKey: 'aesthetic', fields: [{ type: 'textarea', id: 'area_images-esthetique', placeholderKey: 'aesthetic' }] },
         { id: 'images-style', labelKey: 'style', fields: [{ type: 'textarea', id: 'area_images-style', placeholderKey: 'style' }] }
    ]
};
