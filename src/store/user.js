import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: {
            id: null,
            name: "",
            email: "",
            avatar: "",
            role: "", // Campo para el rol del usuario
            isActive: true, // Para manejar usuarios activos/inactivos si es necesario
        },
    }),
    getters: {
        isAuthenticated(state) {
            return !!state.user.id; // Verifica si el usuario está autenticado
        },
        isDirectivo(state) {
            return state.user.role === "DIRECTIVO";
        },
        isJefePrensa(state) {
            return state.user.role === "JEFE_PRENSA";
        },
        isJefeRedaccion(state) {
            return state.user.role === "JEFE_REDACCION";
        },
        isRedactor(state) {
            return state.user.role === "REDACTOR";
        },
        isPanelista(state) {
            return state.user.role === "PANELISTA";
        },
        isEditor(state) {
            return state.user.role === "EDITOR";
        },
        isLocutor(state) {
            return state.user.role === "LOCUTOR";
        },
        isJefeEntrevista(state) {
            return state.user.role === "JEFE_ENTREVISTA";
        },
    },
    actions: {
        async login(email, password) {
            try {
                const response = await axios.post("http://localhost:3300/api/auth/login", {
                    email,
                    password,
                });
                console.log("Response:", response); // <-- Agregado para depurar


                if (response.status === 200) {
                    this.user = response.data; // Actualiza el estado del usuario
                    localStorage.setItem("userId", this.user.id); // Guarda el ID del usuario
                    localStorage.setItem("isLoggedIn", "true"); // Marca que el usuario está autenticado
                } else {
                    throw new Error("Error en la autenticación: Usuario no encontrado o inactivo.");
                }
            } catch (error) {
                console.error("Error al iniciar sesión:", error.message || error);
                throw error;
            }
        },
        async fetchUser() {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                console.warn("No hay un usuario logueado.");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/users/${userId}`);
                if (response.status === 200) {
                    this.user = response.data; // Actualiza el estado con los datos del usuario
                } else {
                    console.warn("Error al obtener el usuario: Respuesta inesperada.");
                }
            } catch (error) {
                console.error("Error al obtener los datos del usuario:", error.message || error);
            }
        },
        async updateUser(user) {
            try {
                const response = await axios.put(`http://localhost:3000/users/${user.id}`, user);
                if (response.status === 200) {
                    this.user = response.data; // Actualiza el estado del usuario
                } else {
                    throw new Error("Error al actualizar el usuario.");
                }
            } catch (error) {
                console.error("Error al actualizar el usuario:", error.message || error);
                throw error;
            }
        },
        async updateAvatar(avatar) {
            try {
                const response = await axios.put(`http://localhost:3000/users/${this.user.id}`, {
                    ...this.user,
                    avatar,
                });
                if (response.status === 200) {
                    this.user.avatar = response.data.avatar; // Actualiza solo el avatar
                } else {
                    throw new Error("Error al actualizar el avatar.");
                }
            } catch (error) {
                console.error("Error al actualizar el avatar:", error.message || error);
                throw error;
            }
        },
        async updatePassword(currentPassword, newPassword) {
            try {
                const response = await axios.put(`http://localhost:3000/users/${this.user.id}`, {
                    ...this.user,
                    password: newPassword,
                });
                if (response.status === 200) {
                    alert("Contraseña actualizada correctamente.");
                } else {
                    throw new Error("Error al actualizar la contraseña.");
                }
            } catch (error) {
                console.error("Error al actualizar la contraseña:", error.message || error);
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
                isActive: true,
            };
            localStorage.removeItem("userId");
            localStorage.removeItem("isLoggedIn");
        },
    },
});
