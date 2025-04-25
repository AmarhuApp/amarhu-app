import { defineStore } from "pinia";
import axios from "axios";
import { markAuthReady, resetAuthReady } from "@/utils/authReady";
import { safeSession } from "@/utils/safeSession";

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
        loading: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.user.id,
        isRole: (state) => (role) => state.user.role === role,
    },

    actions: {
        async initializeSession() {
            try {
                const token = safeSession.get("token");
                const userData = safeSession.get("user");

                if (token && userData) {
                    console.log("🔐 Restaurando sesión...");
                    this.user = JSON.parse(userData);
                } else {
                    console.warn("⚠️ No hay sesión previa activa.");
                }
            } catch (err) {
                console.error("❌ Error al inicializar sesión:", err);
            } finally {
                markAuthReady();
            }
        },

        async login(email, password) {
            resetAuthReady();
            this.loading = true;
            try {
                const response = await axios.post(
                    "https://api.pa-reporte.com/api/auth/login",
                    JSON.stringify({ email, password }),
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                    }
                );

                if (response.status === 200) {
                    const { jwt, user } = response.data;

                    this.user = user;
                    console.log("🔐 Usuario después del login:", this.user);

                    safeSession.set("token", jwt);
                    safeSession.set("userId", user.id); // Opcional, ya está en this.user
                    safeSession.set("user", JSON.stringify(user)); // Guarda todo
                    safeSession.set("isLoggedIn", "true");
                }
            } catch (error) {
                console.error("❌ Error al iniciar sesión:", error.response?.data || error.message || error);
                throw error;
            } finally {
                markAuthReady();
                this.loading = false;
            }
        },

        async updateUser(user) {
            const token = safeSession.get("token");
            try {
                const response = await axios.put(
                    `https://api.pa-reporte.com/api/user/${user.id}`,
                    user,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.status === 200) {
                    this.user = response.data;
                    safeSession.set("user", JSON.stringify(this.user));
                }
            } catch (error) {
                console.error("❌ Error al actualizar el usuario:", error.response?.data || error.message || error);
                throw error;
            }
        },

        async updateAvatar(avatar) {
            const token = safeSession.get("token");
            try {
                const response = await axios.put(
                    `https://api.pa-reporte.com/api/user/${this.user.id}`,
                    { ...this.user, avatar },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.status === 200) {
                    this.user.avatar = response.data.avatar;
                    safeSession.set("user", JSON.stringify(this.user));
                }
            } catch (error) {
                console.error("❌ Error al actualizar avatar:", error.response?.data || error.message || error);
                throw error;
            }
        },

        async updatePassword(newPassword) {
            const token = safeSession.get("token");
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
                console.error("❌ Error al actualizar contraseña:", error.response?.data || error.message || error);
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
            safeSession.clear();
            resetAuthReady();
        },
    },
});
