/**
 * Environment Configuration
 * Centralized configuration for API endpoints and environment-specific settings
 */

class Environment {
  constructor() {
    this.validateEnvironment();
  }

  validateEnvironment() {
    if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_API_BASE_URL) {
      console.error('❌ CRITICAL: REACT_APP_API_BASE_URL is required for production builds!');
      console.error('Please set REACT_APP_API_BASE_URL in your environment variables or .env.production file');
    }
  }

  getApiBaseUrl() {
    const baseUrl = process.env.REACT_APP_API_BASE_URL;
    
    if (!baseUrl) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('API Base URL is not configured for production environment');
      }
      console.warn('⚠️ Using development fallback API URL');
      return 'http://localhost:8000';
    }
    
    return baseUrl;
  }

  isProduction() {
    return process.env.NODE_ENV === 'production';
  }

  isDevelopment() {
    return process.env.NODE_ENV === 'development';
  }

  getEnvironmentInfo() {
    return {
      nodeEnv: process.env.NODE_ENV,
      apiBaseUrl: this.getApiBaseUrl(),
      isProduction: this.isProduction(),
      isDevelopment: this.isDevelopment()
    };
  }
}

// Export singleton instance
export const environment = new Environment();
export default Environment;