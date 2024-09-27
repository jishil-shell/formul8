import axios from 'axios';

// Create an instance of axios
const api = axios.create({
    baseURL: 'http://172.206.209.198:8000/', // Replace with your API base URL
    timeout: 300000, // Request timeout
    headers: {
      'Content-Type': 'application/json',
      // Add other default headers here if needed
    },
  });
  
  // Request interceptor
  api.interceptors.request.use(
    config => {
      // Modify config before sending request (e.g., add auth token)
      const token = localStorage.getItem('token'); // Example: getting a token from localStorage
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
  
  // Response interceptor
  api.interceptors.response.use(
    response => response,
    error => {
      // Handle common errors (e.g., 401 Unauthorized)
      if (error.response && error.response.status === 401) {
        // Optionally: Redirect to login or show a modal
      }
      return Promise.reject(error);
    }
  );
  
  // API calls  
  export const solverOptimalFormulation = async (data) => {
    try {
      const response = await api.post('/solver', data);
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };

  export const getTemplates = async (data) => {
    try {
      const response = await api.post('/getsolvertemplates', data);
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };

  export const checkTemplateApi = async (data) => {
    try {
      const response = await api.get('/checktemplatename', {params : data});
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };

  export const saveTemplateApi = async (data) => {
    try {
      const response = await api.post('/savetemplate', data);
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };

  export const deleteTemplateApi = async (data) => {
    try {
      const response = await api.post('/deletetemplate', data);
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };
  
  // Add more API calls as needed
  
  export default api;