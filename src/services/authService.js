import axios from 'axios';

// Usar rutas relativas en lugar de absolutas
const API_URL = '';
console.log("Using relative API URLs for auth");

// Helper to set the auth token in axios headers
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("Set global auth token:", token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Initialize axios with token if exists
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

const authService = {
  // Login user
  login: async (email, password) => {
    try {
      console.log("Attempting login with:", { email });
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      const { token, user } = response.data;
      console.log("Login successful, received token and user:", { token: token?.substring(0, 10) + "...", user });
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth token in axios headers
      setAuthToken(token);
      
      return { token, user };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    console.log("Logging out, removing token");
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove auth token from axios headers
    setAuthToken(null);
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const isAuth = localStorage.getItem('token') !== null;
    console.log("Auth check:", isAuth);
    return isAuth;
  },
  
  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService; 