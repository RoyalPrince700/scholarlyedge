import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateDetails: (userData) => api.put('/auth/updatedetails', userData),
  updatePassword: (passwordData) => api.put('/auth/updatepassword', passwordData),
  logout: () => api.get('/auth/logout'),
};

// Users API
export const usersAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Projects API
export const projectsAPI = {
  getProjects: (params) => api.get('/projects', { params }),
  createProject: (projectData) => api.post('/projects', projectData),
  getProject: (id) => api.get(`/projects/${id}`),
  updateProject: (id, projectData) => api.put(`/projects/${id}`, projectData),
  deleteProject: (id) => api.delete(`/projects/${id}`),
  assignProject: (id, assignmentData) => api.put(`/projects/${id}/assign`, assignmentData),
  updateStatus: (id, statusData) => api.put(`/projects/${id}/status`, statusData),
  recordPayment: (id, paymentData) => api.post(`/projects/${id}/payment`, paymentData),
};

// Financial API
export const financialAPI = {
  getRecords: (params) => api.get('/financial', { params }),
  createRecord: (recordData) => api.post('/financial', recordData),
  getRecord: (id) => api.get(`/financial/${id}`),
  updateRecord: (id, recordData) => api.put(`/financial/${id}`, recordData),
  deleteRecord: (id) => api.delete(`/financial/${id}`),
  getSummary: () => api.get('/financial/reports/summary'),
  getIncomeReport: (params) => api.get('/financial/reports/income', { params }),
  getExpenseReport: (params) => api.get('/financial/reports/expenses', { params }),
};

export default api;