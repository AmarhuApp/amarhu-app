import axios from 'axios';

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.error("Sesión expirada. Redirigiendo al login...");
            localStorage.removeItem('token');
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
