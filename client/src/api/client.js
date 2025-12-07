import axios from 'axios';

// Use environment variable for API URL (set by Vercel in production)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const sendOTP = (phone) => api.post('/auth/send-otp', { phone });
export const verifyOTP = (phone, otp) => api.post('/auth/verify-otp', { phone, otp });
export const register = (data) => api.post('/auth/register', data);

// Events
export const getEvents = () => api.get('/events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Applications
export const applyForEvent = (eventId) => api.post('/applications', { eventId });
export const getMyApplications = () => api.get('/applications/my-applications');
export const getEventApplications = (eventId) => api.get(`/applications/event/${eventId}`);
export const updateApplicationStatus = (id, status) => api.patch(`/applications/${id}`, { status });
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

export default api;
