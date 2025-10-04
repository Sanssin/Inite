/**
 * Backend Data Service - Dynamic data fetching from backend APIs
 * This service connects the frontend to the OOP-based backend for real-time data
 */

class BackendDataService {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
    }

    /**
     * Fetch detailed isotope information from backend
     */
    async getIsotopeDetails() {
        try {
            const response = await fetch(`${this.baseURL}/isotope_details`);
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
            const response = await fetch(`${this.baseURL}/material_details?source_type=${sourceType}`);
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
                name: 'Kaca (Glass)',
                density: 3.8,
                atomic_number: '~20-30',
                key: 'kaca'
            }
        };

        // Add source-specific HVL and attenuation data
        const hvlData = {
            'cs-137': { timbal: 0.58, beton: 4.8, kaca: 1.8 },
            'co-60': { timbal: 1.0, beton: 6.2, kaca: 2.2 },
            'na-22': { timbal: 0.8, beton: 5.5, kaca: 2.0 }
        };

        const attenuationData = {
            'cs-137': { timbal: 1.2, beton: 0.15, kaca: 0.086 },
            'co-60': { timbal: 0.7, beton: 0.1, kaca: 0.063 },
            'na-22': { timbal: 0.5, beton: 0.09, kaca: 0.12 }
        };

        // Add source-specific data to each material
        Object.keys(materialData).forEach(key => {
            materialData[key].hvl = hvlData[sourceType][key] || 0;
            materialData[key].attenuation_coefficient = attenuationData[sourceType][key] || 0;
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
            'kaca': 'glass'
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
            'timbal': '🛡️',
            'beton': '🧱',
            'kaca': '🪟'
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
            'ir-192': '💎',
            'tc-99m': '🧪'
        };
        
        return iconMap[isotopeKey.toLowerCase()] || '☢️';
    }

    /**
     * Get default description for isotopes
     */
    getIsotopeDescription(isotopeKey) {
        const descriptions = {
            'cs-137': 'Isotop radioaktif yang umum digunakan dalam aplikasi medis dan industri. Memancarkan sinar gamma dengan energi tinggi.',
            'co-60': 'Isotop radioaktif dengan aktivitas tinggi, sering digunakan dalam terapi kanker dan sterilisasi industri.',
            'na-22': 'Isotop yang diproduksi secara artifisial, digunakan dalam penelitian dan kalibrasi detektor.'
        };
        
        return descriptions[isotopeKey.toLowerCase()] || 'Isotop radioaktif untuk berbagai aplikasi ilmiah dan industri.';
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
        };
        
        return symbolMap[isotopeKey.toLowerCase()] || isotopeKey.toUpperCase();
    }
    getMaterialDescription(materialKey) {
        const descriptions = {
            'lead': 'Material paling efektif untuk perisai radiasi gamma karena densitas dan nomor atom yang tinggi.',
            'concrete': 'Material konstruksi yang ekonomis dan praktis untuk perisai radiasi dalam skala besar.',
            'glass': 'Kaca khusus yang mengandung timbal, memberikan perlindungan sambil mempertahankan transparansi.',
            'timbal': 'Material paling efektif untuk perisai radiasi gamma karena densitas dan nomor atom yang tinggi.',
            'beton': 'Material konstruksi yang ekonomis dan praktis untuk perisai radiasi dalam skala besar.',
            'kaca': 'Kaca khusus yang mengandung timbal, memberikan perlindungan sambil mempertahankan transparansi.'
        };
        
        return descriptions[materialKey.toLowerCase()] || 'Material perisai radiasi berkualitas tinggi untuk proteksi optimal terhadap paparan radiasi gamma.';
    }
}

// Export singleton instance
export const backendDataService = new BackendDataService();
export default BackendDataService;