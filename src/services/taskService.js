import axios from 'axios';

// Usar rutas relativas en lugar de absolutas
const API_URL = '';
console.log("Using relative API URLs");

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log("Using auth token:", token);
  return {
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
};

// Configurar interceptor para logs de errores de axios
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API Error Response:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

const taskService = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      console.log("Fetching tasks from:", `${API_URL}/api/tasks`);
      const response = await axios.get(`${API_URL}/api/tasks`, getAuthHeaders());
      console.log("Tasks API response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  // Get task by ID
  getTaskById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      return null;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      console.log("Creating task with data:", taskData);
      const response = await axios.post(`${API_URL}/api/tasks`, taskData, getAuthHeaders());
      console.log("Create task response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (id, taskData) => {
    try {
      console.log(`Updating task ${id} with data:`, taskData);
      const response = await axios.put(`${API_URL}/api/tasks/${id}`, taskData, getAuthHeaders());
      console.log("Update task response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating task ${id}:`, error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    try {
      console.log(`Deleting task ${id}`);
      const response = await axios.delete(`${API_URL}/api/tasks/${id}`, getAuthHeaders());
      console.log("Delete task response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting task ${id}:`, error);
      throw error;
    }
  },

  // Get task statistics
  getTaskStatistics: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tasks/statistics`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching task statistics:', error);
      return {
        todo: 0,
        inProgress: 0,
        completed: 0
      };
    }
  }
};

export default taskService; 