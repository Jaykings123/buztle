import axios from 'axios';

// Use environment variable for API URL (Next.js public var)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Helper to set the token for all requests
export const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

// Events
export const getEvents = () => api.get('/events');
export const getMyEvents = () => api.get('/events/my-events');
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (data) => api.post('/events', data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Applications
export const applyForEvent = (eventId) => api.post('/applications', { eventId });
export const getMyApplications = () => api.get('/applications/my-applications');
export const getEventApplications = (eventId) => api.get(`/applications/event/${eventId}`);
export const updateApplicationStatus = (id, status) => api.patch(`/applications/${id}`, { status });
export const deleteApplication = (id) => api.delete(`/applications/${id}`);

// Users
export const updateUserRole = (role) => api.post('/users/update-role', { role });
export const getProfile = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/profile', data);

export default api;
