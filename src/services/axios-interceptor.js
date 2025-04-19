import axios from "axios";
import { safeSession } from "@/utils/safeSession";

let tokenCheckInterval;

function waitForToken(timeout = 3000) {
    return new Promise((resolve) => {
        const start = Date.now();
        tokenCheckInterval = setInterval(() => {
            const token = safeSession.get("token");
            const elapsed = Date.now() - start;
            if (token || elapsed >= timeout) {
                clearInterval(tokenCheckInterval);
                resolve();
            }
        }, 50);
    });
}

axios.interceptors.request.use(async (config) => {
    await waitForToken();
    const token = safeSession.get("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => Promise.reject(error));

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.warn("🔒 Sesión expirada. Redirigiendo...");
            safeSession.clear();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);