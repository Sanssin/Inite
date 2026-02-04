/**
 * i18n Mappings - Utility untuk mapping antara display names dan internal keys
 * Memastikan backend API tetap menerima key internal yang konsisten
 */

// Isotope mapping: internal key → display name key
export const isotopeDisplayKeys = {
    'cs-137': 'isotopes.cs137',
    'co-60': 'isotopes.co60',
    'na-22': 'isotopes.na22',
    'am-241': 'isotopes.am241'
};

// Material mapping: internal key → display name key
export const materialDisplayKeys = {
    'lead': 'materials.lead',
    'timbal': 'materials.lead',
    'concrete': 'materials.concrete',
    'beton': 'materials.concrete',
    'glass': 'materials.glass',
    'kaca': 'materials.glass',
    'steel': 'materials.steel',
    'baja': 'materials.steel'
};

// Reverse mapping: display name → internal key
export const materialInternalKeys = {
    'Timbal (Lead)': 'lead',
    'Lead': 'lead',
    'Beton (Concrete)': 'concrete',
    'Concrete': 'concrete',
    'Kaca (Glass)': 'glass',
    'Glass': 'glass',
    'Baja (Steel)': 'steel',
    'Steel': 'steel'
};

/**
 * Get display name from internal key
 * @param {string} key - Internal key (e.g., 'cs-137')
 * @param {function} t - Translation function
 * @returns {string} Translated display name
 */
export const getIsotopeDisplayName = (key, t) => {
    const translationKey = isotopeDisplayKeys[key];
    return translationKey ? t(translationKey) : key;
};

/**
 * Get material display name from internal key
 * @param {string} key - Internal key (e.g., 'lead')
 * @param {function} t - Translation function
 * @returns {string} Translated display name
 */
export const getMaterialDisplayName = (key, t) => {
    const normalizedKey = key.toLowerCase();
    const translationKey = materialDisplayKeys[normalizedKey];
    return translationKey ? t(translationKey) : key;
};

/**
 * Extract internal key from display name (for backward compatibility)
 * @param {string} displayName - Display name (e.g., 'Timbal (Lead)')
 * @returns {string} Internal key (e.g., 'lead')
 */
export const extractInternalKey = (displayName) => {
    // Check if we have a direct mapping
    if (materialInternalKeys[displayName]) {
        return materialInternalKeys[displayName];
    }

    // Try to extract from parentheses: "Timbal (Lead)" → "lead"
    const match = displayName.match(/\(([^)]+)\)/);
    if (match) {
        return match[1].toLowerCase();
    }

    // Fallback: use first word lowercase
    return displayName.toLowerCase().split(' ')[0];
};

/**
 * Translate safety message from backend
 * @param {string} message - Backend message (Indonesian)
 * @param {function} t - Translation function
 * @returns {string} Translated message
 */
export const translateSafetyMessage = (message, t) => {
    if (!message) return '';

    if (message.includes('terlalu dekat')) {
        return t('simulation:safety.tooClose');
    }
    if (message.includes('BAHAYA')) {
        return t('simulation:safety.danger');
    }
    if (message.includes('PERINGATAN')) {
        return t('simulation:safety.warning');
    }
    if (message.includes('AMAN')) {
        return t('simulation:safety.safe');
    }

    return message;
};
