import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001/api', // Make sure this matches backend URL
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
