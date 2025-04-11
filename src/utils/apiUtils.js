import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

/**
 * Utility to check if the API is accessible
 * Used for both local development and production environments
 */
export const checkApiConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/health`);
    return {
      success: response.status === 200,
      message: 'Connected to API successfully',
      apiUrl: API_URL
    };
  } catch (error) {
    console.error('API Connection Error:', error);
    return {
      success: false,
      message: `Failed to connect to API at ${API_URL}. Check your connection and MongoDB Atlas status.`,
      error: error.message
    };
  }
};

/**
 * Get the current environment information
 */
export const getEnvironmentInfo = () => {
  return {
    nodeEnv: process.env.NODE_ENV,
    apiUrl: API_URL,
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    hasApiUrl: !!process.env.REACT_APP_API_URL
  };
};

export default {
  checkApiConnection,
  getEnvironmentInfo,
  API_URL
}; 