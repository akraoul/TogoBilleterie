import axios from 'axios';

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const api = axios.create({
    baseURL: `${BACKEND_URL}/api`,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

export const fetchEvents = async () => {
    const { data } = await api.get('/events/public');
    return data;
};

export const fetchEventById = async (id: string | number) => {
    try {
        const { data } = await api.get(`/events/${id}`);
        return data;
    } catch (error) {
        console.error("Error fetching event details:", error);
        return null;
    }
};
