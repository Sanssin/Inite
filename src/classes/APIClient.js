/**
 * APIClient Class - OOP implementation for API communication
 */

class APIResponse {
  constructor(data = null, error = null) {
    this.data = data;
    this.error = error;
    this.isSuccess = error === null;
  }

  static success(data) {
    return new APIResponse(data, null);
  }

  static error(message) {
    return new APIResponse(null, message);
  }
}

class APIClient {
  constructor(baseUrl = null) {
    this.baseUrl = baseUrl || this.getDefaultBaseUrl();
  }

  getDefaultBaseUrl() {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    if (!apiBaseUrl) {
      console.warn("⚠️ REACT_APP_API_BASE_URL is not defined!");
      if (process.env.NODE_ENV === 'production') {
        console.error("❌ Production build missing API configuration!");
        return ""; // In production, this should cause obvious failures
      }
      return "http://localhost:8000"; // Fallback for development only
    }
    return apiBaseUrl;
  }

  async makeRequest(endpoint, params = {}) {
    try {
      const url = new URL(`${this.baseUrl}${endpoint}`);
      
      // Add query parameters
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });

      console.log("🌐 API Request:", url.toString());
      
      const response = await fetch(url);
      console.log("📡 Response Status:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("✅ API Response Data:", data);
      
      return APIResponse.success(data);
      
    } catch (error) {
      console.error("❌ API Request Failed:");
      console.error("- Error:", error.message);
      console.error("- Endpoint:", endpoint);
      console.error("- Params:", params);
      
      return APIResponse.error(`Connection failed: ${error.message}`);
    }
  }

  async calculateDose(distance, sourceType, initialActivity, shieldingMaterial, shieldThickness = 0) {
    // Map shielding material names to backend keys
    const materialMapping = {
      'timbal': 'timbal',
      'lead': 'lead', 
      'beton': 'beton',
      'concrete': 'concrete',
      'kaca': 'kaca',
      'glass': 'glass'
    };

    // Clean up shieldingMaterial string (e.g., "Timbal (Lead)" -> "Timbal" -> "timbal")
    let cleanedMaterial = shieldingMaterial.split(' ')[0].toLowerCase();
    
    // Use mapping if available, otherwise use cleaned material
    const finalMaterial = materialMapping[cleanedMaterial] || cleanedMaterial;

    const params = {
      distance: distance,
      source_type: sourceType,
      initial_activity: initialActivity,
      shielding_material: finalMaterial,
      shield_thickness: shieldThickness
    };

    return await this.makeRequest('/calculate_dose', params);
  }

  async getAvailableIsotopes() {
    return await this.makeRequest('/available_isotopes');
  }

  async getAvailableMaterials() {
    return await this.makeRequest('/available_materials');
  }

  async getSourceInfo() {
    return await this.makeRequest('/source_info');
  }

  async getShieldingInfo() {
    return await this.makeRequest('/shielding_info');
  }

  // Health check method
  async healthCheck() {
    try {
      const response = await this.makeRequest('/');
      return response.isSuccess;
    } catch {
      return false;
    }
  }
}

export { APIClient, APIResponse };