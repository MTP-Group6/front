// src/api/request.js
import axios from 'axios';

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// Request interceptor
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor
request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // Handle common error codes
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized, clear auth and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Mock adapter - prevent real API calls
const originalRequest = request.request;
request.request = function(config) {
  console.log(`[Mock] Prevented API call to: ${config.url}`);
  
  // Simulate a successful response for any API call
  return Promise.resolve({
    data: [],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: config
  });
};

export default request;