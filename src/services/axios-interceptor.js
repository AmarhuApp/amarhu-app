// axios.js o main.js
import axios from 'axios';

axios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('token');
    console.log("TOKEN enviado:", token); // 🔍 agrega esto

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.error("Sesión expirada. Redirigiendo al login...");
            sessionStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
