import axios from 'axios';

// Set the base URL for API calls - use relative URL
const API_URL = '';
console.log("tasksService using relative API URLs");

// Add authorization token to requests if available
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log("tasksService using token:", token?.substring(0, 10) + "...");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Service for task operations
const tasksService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      console.log("tasksService fetching tasks");
      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: getAuthHeader()
      });
      console.log("tasksService received tasks:", response.data.length);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      console.log("tasksService creating task:", taskData);
      const response = await axios.post(`${API_URL}/api/tasks`, taskData, {
        headers: getAuthHeader()
      });
      console.log("tasksService task created:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (id, taskData) => {
    try {
      console.log(`tasksService updating task ${id}:`, taskData);
      const response = await axios.put(`${API_URL}/api/tasks/${id}`, taskData, {
        headers: getAuthHeader()
      });
      console.log("tasksService task updated:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    try {
      console.log(`tasksService deleting task ${id}`);
      const response = await axios.delete(`${API_URL}/api/tasks/${id}`, {
        headers: getAuthHeader()
      });
      console.log("tasksService task deleted:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Simple login function
  login: async (credentials) => {
    try {
      console.log("tasksService login attempt:", credentials.email);
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log("tasksService login success, token stored");
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // Logout function
  logout: () => {
    console.log("tasksService logging out");
    localStorage.removeItem('token');
  }
};

export default tasksService; 