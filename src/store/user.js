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
                const userId = safeSession.get("userId");

                if (token && userId) {
                    console.log("🔐 Restaurando sesión...");
                    await this.fetchUser();
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
                    this.user = response.data;

                    safeSession.set("token", response.data.jwt);
                    safeSession.set("userId", response.data.id);
                    safeSession.set("isLoggedIn", "true");

                    // ⏱️ Espera breve para asegurar persistencia del token
                    await new Promise(resolve => setTimeout(resolve, 100));

                    try {
                        await this.fetchUser();
                    } catch (fetchError) {
                        console.warn("⚠️ Error al obtener usuario tras login:", fetchError);
                    }
                }
            } catch (error) {
                console.error("❌ Error al iniciar sesión:", error.response?.data || error.message || error);
                throw error; // necesario para que el componente lo capture
            } finally {
                markAuthReady();
                this.loading = false;
            }
        },

        async fetchUser() {
            const token = safeSession.get("token");
            const userId = safeSession.get("userId");

            if (!token || !userId) {
                console.warn("⚠️ No hay token o ID de usuario.");
                return;
            }

            try {
                const response = await axios.get("https://api.pa-reporte.com/api/user", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200 && response.data?.id === parseInt(userId)) {
                    this.user = response.data;
                    console.log("✅ Usuario restaurado:", this.user);
                }
            } catch (error) {
                console.error("❌ Error al obtener los datos del usuario:", error.response?.data || error.message || error);
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
