import axios from 'axios';

// Create an instance of axios
const api = axios.create({
    //baseURL: 'http://172.206.209.198:8000/',
    baseURL: 'http://20.82.143.0:8000/',
    timeout: 300000, // Request timeout
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  // Request interceptor
  api.interceptors.request.use(
    config => {
      let accessToken = localStorage.getItem('token');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => Promise.reject(error)
  );
  
  // Response interceptor
  api.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        originalRequest._retry = true;
        const apiResponse = await validateUser({
          userName: 'INJKP0'
        });
        if(apiResponse?.status && apiResponse.accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${apiResponse.accessToken}`;
        }
        
        return api(originalRequest);
      }
      return Promise.reject(error);
    }
  );
  
  // API calls  

  export const validateUser = async (data) => {
    try {
      const response = await api.post('/userLogin', data);
      let apiResponse = response?.data || {};
      if(apiResponse?.status && apiResponse?.accessToken) {
        localStorage.setItem('token', apiResponse?.accessToken);
      }
      return apiResponse;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };

  export const getTemplates = async (data) => {
    try {
      const response = await api.post('/getUserTemplates', data);
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };

  export const getTemplateMappings = async (data) => {
    try {
      const response = await api.post('/getTemplateShareList', data);
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };

  export const updateTemplateMappings = async (data) => {
    try {
      const response = await api.post('/saveTemplateShareList', data);
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };

  export const saveTemplateApi = async (data) => {
    try {
      const response = await api.post('/saveTemplate', data);
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };

  export const deleteTemplateApi = async (data) => {
    try {
      const response = await api.post('/deleteTemplate', data);
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };

  export const getResultsFromSolver = async (data) => {
    try {
      const response = await api.post('/getResultsFromSolver', data);
      return response?.data || false;
    } catch (error) {
      console.error('Error creating resource:', error);
      return false;
    }
  };
  
  // Add more API calls as needed
  
  export default api;