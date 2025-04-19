// store/user.js
import { defineStore } from "pinia";
import axios from "axios";
import { safeStorage } from "@/utils/safeStorage";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: {
            id: null,
            name: "",
            email: "",
            avatar: "",
            role: "",
            active: true,
        },
    }),
    getters: {
        isAuthenticated(state) {
            return !!state.user.id;
        },
        isRole: (state) => (role) => state.user.role === role,
    },
    actions: {
        async login(email, password) {
            try {
                const response = await axios.post(
                    "https://api.pa-reporte.com/api/auth/login",
                    JSON.stringify({ email, password }),
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        }
                    }
                );

                if (response.status === 200) {
                    this.user = response.data;
                    sessionStorage.setItem("token", response.data.jwt);
                    sessionStorage.setItem("userId", this.user.id);
                    sessionStorage.setItem("isLoggedIn", "true");
                    await this.fetchUser();
                }
            } catch (error) {
                console.error("Error al iniciar sesión:", error.response?.data || error.message || error);
                throw error;
            }
        },

        async fetchUser() {
            const userId = sessionStorage.getItem("userId");
            const token = sessionStorage.getItem("token");
            if (!userId || !token) {
                console.warn("No hay un usuario logueado o falta el token.");
                return;
            }

            try {
                const response = await axios.get(`https://api.pa-reporte.com/api/user`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 200) {
                    const user = response.data;
                    if (user.id === parseInt(userId)) {
                        this.user = user;
                    }
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error.response?.data || error.message || error);
            }
        },

        async updateUser(user) {
            const token = sessionStorage.getItem("token");
            try {
                const response = await axios.put(
                    `https://api.pa-reporte.com/api/user/${user.id}`,
                    user,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.status === 200) {
                    this.user = response.data;
                } else {
                    throw new Error("Error al actualizar el usuario.");
                }
            } catch (error) {
                console.error("Error al actualizar el usuario:", error.response?.data || error.message || error);
                throw error;
            }
        },

        async updateAvatar(avatar) {
            const token = sessionStorage.getItem("token");
            try {
                const response = await axios.put(
                    `https://api.pa-reporte.com/api/user/${this.user.id}`,
                    { ...this.user, avatar },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.status === 200) {
                    this.user.avatar = response.data.avatar;
                }
            } catch (error) {
                console.error("Error al actualizar el avatar:", error.response?.data || error.message || error);
                throw error;
            }
        },

        async updatePassword(newPassword) {
            const token = sessionStorage.getItem("token");
            try {
                const response = await axios.put(
                    `https://api.pa-reporte.com/api/user/${this.user.id}`,
                    { ...this.user, password: newPassword },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.status === 200) {
                    alert("Contraseña actualizada correctamente.");
                }
            } catch (error) {
                console.error("Error al actualizar la contraseña:", error.response?.data || error.message || error);
                alert("No se pudo actualizar la contraseña.");
                throw error;
            }
        },

        logout() {
            this.user = {
                id: null,
                name: "",
                email: "",
                avatar: "",
                role: "",
                active: true,
            };
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("isLoggedIn");
            sessionStorage.removeItem("token");
        },
    },
});
