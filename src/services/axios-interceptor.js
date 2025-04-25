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
    const token = safeSession.get("token");

    // Excepciones: No cancelar si es login u otra ruta pública
    const publicRoutes = ["/api/auth/login", "/api/auth/register"];
    const isPublicRoute = publicRoutes.some(route => config.url.includes(route));

    if (!token && !isPublicRoute) {
        console.warn("⏳ Token no disponible, cancelando solicitud:", config.url);
        return Promise.reject(new axios.Cancel("Token no disponible"));
    }

    if (token && !isPublicRoute) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    document.body.style.backgroundColor = "#f9f9f9";

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
