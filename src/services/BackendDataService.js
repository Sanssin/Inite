/**
 * Backend Data Service - Dynamic data fetching from backend APIs
 * This service connects the frontend to the OOP-based backend for real-time data
 */

class BackendDataService {
    constructor(baseURL = '') {
        this.baseURL = baseURL || this.getDefaultBaseURL();
    }

    getDefaultBaseURL() {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
        if (!apiBaseUrl) {
            console.warn('⚠️ REACT_APP_API_BASE_URL is not defined! Using fallback for development only.');
            return process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000';
        }
        return apiBaseUrl;
    }

    /**
     * Fetch detailed isotope information from backend
     */
    async getIsotopeDetails() {
        try {
            const url = `${this.baseURL}/isotope_details`;
            console.log('🔗 Fetching isotope details from:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return {
                success: true,
                data: data.isotope_details
            };
        } catch (error) {
            console.warn('Failed to fetch isotope details from backend:', error);
            return {
                success: false,
                error: error.message,
                data: this.getFallbackIsotopeData()
            };
        }
    }

    /**
     * Fetch detailed material information from backend
     */
    async getMaterialDetails(sourceType = 'cs-137') {
        try {
            const url = `${this.baseURL}/material_details?source_type=${sourceType}`;
            console.log('🔗 Fetching material details from:', url);
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return {
                success: true,
                data: data.material_details
            };
        } catch (error) {
            console.warn('Failed to fetch material details from backend:', error);
            return {
                success: false,
                error: error.message,
                data: this.getFallbackMaterialData(sourceType)
            };
        }
    }

    /**
     * Fallback isotope data when backend is unavailable
     */
    getFallbackIsotopeData() {
        const today = new Date().toISOString().slice(0, 10);
        return {
            'cs-137': {
                name: 'Cesium-137',
                half_life_years: 30.17,
                gamma_constant: 0.327,
                gamma_energy: '662 keV',
                production_date: '1999-09-01',
                symbol: 'Cs-137'
            },
            'co-60': {
                name: 'Cobalt-60',
                half_life_years: 5.27,
                gamma_constant: 1.32,
                gamma_energy: '1.17 & 1.33 MeV',
                production_date: '2018-01-01',
                symbol: 'Co-60'
            },
            'na-22': {
                name: 'Natrium-22',
                half_life_years: 2.6,
                gamma_constant: 0.58,
                gamma_energy: '511 keV & 1.27 MeV',
                production_date: '2019-01-01',
                symbol: 'Na-22'
            },
            'am-241': {
                name: 'Am-241',
                half_life_years: 432.2,
                gamma_constant: 0.318,
                gamma_energy: '59.5 keV',
                production_date: '2024-06-01',
                symbol: 'Am-241'
            },
            'u-235': {
                name: 'Uranium-235',
                half_life_years: 7.04e8,
                gamma_constant: 0.338883,
                gamma_energy: '185.7 keV',
                production_date: '2015-01-01',
                symbol: 'U-235'
            },
            'th-232': {
                name: 'Thorium-232',
                half_life_years: 1.40e10,
                gamma_constant: 0.068376,
                gamma_energy: '63.8 keV',
                production_date: '2015-01-01',
                symbol: 'Th-232'
            },
            'pu-239': {
                name: 'Plutonium-239',
                half_life_years: 24110,
                gamma_constant: 0.0301365,
                gamma_energy: '51.6 keV',
                production_date: '2020-01-01',
                symbol: 'Pu-239'
            },
            'i-131': {
                name: 'Iodine-131',
                half_life_years: 8.0252 / 365.25,
                gamma_constant: 0.282939,
                gamma_energy: '364.5 keV',
                production_date: today,
                symbol: 'I-131'
            }
        };
    }

    /**
     * Fallback material data when backend is unavailable
     */
    getFallbackMaterialData(sourceType) {
        const materialData = {
            timbal: {
                name: 'Timbal (Lead)',
                density: 11.34,
                atomic_number: '82',
                key: 'timbal'
            },
            beton: {
                name: 'Beton (Concrete)',
                density: 2.3,
                atomic_number: '~11-14',
                key: 'beton'
            },
            kaca: {
                name: 'Kaca Timbal (Lead Glass)',
                density: 6.22,
                atomic_number: '~14, 22, 82',
                key: 'kaca'
            },
            baja: {
                name: 'Baja (Steel)',
                density: 7.85,
                atomic_number: '26',
                key: 'baja'
            }
        };

        // Add source-specific HVL and attenuation data
        const hvlData = {
            'cs-137': { timbal: 0.58, beton: 4.8, kaca: 1.8, baja: 0.73 },
            'co-60': { timbal: 1.0, beton: 6.2, kaca: 2.2, baja: 1.33 },
            'na-22': { timbal: 0.8, beton: 5.5, kaca: 2.0, baja: 1.54 },
            'am-241': { timbal: 0.46, beton: 3.47, kaca: 6.30, baja: 0.58 },
            'u-235': { timbal: 0.05, beton: 2.27, kaca: 0.11, baja: 0.55 },
            'th-232': { timbal: 0.01, beton: 1.19, kaca: 0.03, baja: 0.08 },
            'pu-239': { timbal: 0.01, beton: 0.92, kaca: 0.02, baja: 0.05 },
            'i-131': { timbal: 0.21, beton: 2.95, kaca: 0.45, baja: 0.89 }
        };

        const attenuationData = {
            'cs-137': { timbal: 1.2, beton: 0.15, kaca: 0.086, baja: 0.95 },
            'co-60': { timbal: 0.7, beton: 0.1, kaca: 0.063, baja: 0.52 },
            'na-22': { timbal: 0.5, beton: 0.09, kaca: 0.12, baja: 0.45 },
            'am-241': { timbal: 1.5, beton: 0.2, kaca: 0.11, baja: 1.2 },
            'u-235': { timbal: 14.6165, beton: 0.3050, kaca: 6.2303, baja: 1.2593 },
            'th-232': { timbal: 51.3171, beton: 0.5835, kaca: 21.5644, baja: 8.5473 },
            'pu-239': { timbal: 85.6233, beton: 0.7567, kaca: 35.8393, baja: 14.4103 },
            'i-131': { timbal: 3.3221, beton: 0.2347, kaca: 1.5241, baja: 0.7822 }
        };

        const normalizedSourceType = String(sourceType || '').toLowerCase();
        const sourceKey = hvlData[normalizedSourceType] ? normalizedSourceType : 'cs-137';
        const selectedHvlData = hvlData[sourceKey];
        const selectedAttenuationData = attenuationData[sourceKey];

        // Add source-specific data to each material
        Object.keys(materialData).forEach(key => {
            materialData[key].hvl = selectedHvlData[key] || 0;
            materialData[key].attenuation_coefficient = selectedAttenuationData[key] || 0;
        });

        return materialData;
    }

    /**
     * Convert backend material key to frontend format
     */
    convertMaterialKey(backendKey) {
        const keyMapping = {
            'timbal (lead)': 'lead',
            'beton (concrete)': 'concrete',
            'kaca (glass)': 'glass',
            'timbal': 'lead',
            'beton': 'concrete',
            'kaca': 'glass',
            'kaca timbal (lead glass)': 'glass',
            'baja (steel)': 'steel',
            'baja': 'steel'
        };
        
        return keyMapping[backendKey.toLowerCase()] || backendKey;
    }

    /**
     * Get material icon based on material type
     */
    getMaterialIcon(materialKey) {
        const iconMap = {
            'lead': '🛡️',
            'concrete': '🧱',
            'glass': '🪟',
            'steel': '🧱',
            'timbal': '🛡️',
            'beton': '🧱',
            'kaca': '🪟',
            'baja': '🧱'
        };
        
        return iconMap[materialKey.toLowerCase()] || '⚫';
    }

    /**
     * Get isotope icon based on isotope type
     */
    getIsotopeIcon(isotopeKey) {
        const iconMap = {
            'cs-137': '☢️',
            'co-60': '⚛️',
            'na-22': '🔬',
            'am-241': '🌟',
            'u-235': '🧲',
            'th-232': '🪨',
            'pu-239': '☣️',
            'i-131': '🧪',
            'ir-192': '💎',
            'tc-99m': '🧪'
        };
        
        return iconMap[isotopeKey.toLowerCase()] || '☢️';
    }

    /**
     * Get isotope symbol from isotope key
     */
    getIsotopeSymbol(isotopeKey) {
        const symbolMap = {
            'cs-137': 'Cs-137',
            'co-60': 'Co-60',
            'na-22': 'Na-22',
            'am-241': 'Am-241',
            'u-235': 'U-235',
            'th-232': 'Th-232',
            'pu-239': 'Pu-239',
            'i-131': 'I-131',
        };
        
        return symbolMap[isotopeKey.toLowerCase()] || isotopeKey.toUpperCase();
    }
}

// Export singleton instance with proper environment configuration
export const backendDataService = new BackendDataService();
export default BackendDataService;
