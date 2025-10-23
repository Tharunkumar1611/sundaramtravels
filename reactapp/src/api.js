import axios from 'axios';

// Base URL for API endpoints
export const BASE_URL = 'https://sundaramtravels-production.up.railway.app';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors globally
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      // Optionally redirect to login
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoint constants
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  
  // User
  USER_PROFILE: '/api/users/profile',
  ALL_USERS: '/api/users/all',
  
  // Itinerary
  ITINERARY: '/api/itinerary',
  ITINERARY_BY_ID: (id) => `/api/itinerary/${id}`,
  
  // Destination
  DESTINATIONS_PAGED: '/api/destinations/paged',
  DESTINATIONS: '/api/destinations',
  DESTINATION_BY_ID: (id) => `/api/destinations/${id}`,
  
  // Activity
  ACTIVITIES_PAGED: '/api/activities/paged',
  ACTIVITIES: '/api/activities',
  ACTIVITY_BY_ID: (id) => `/api/activities/${id}`,
  
  // Booking
  BOOKINGS_PAGED: '/api/bookings/paged',
  BOOKINGS: '/api/bookings',
  BOOKING_BY_ID: (id) => `/api/bookings/${id}`,
  
  // Expense
  EXPENSES_PAGED: '/api/expenses/paged',
  EXPENSES: '/api/expenses',
  EXPENSE_BY_ID: (id) => `/api/expenses/${id}`,
};
