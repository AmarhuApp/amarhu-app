import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: {
            id: null,
            name: "",
            email: "",
            avatar: "",
            role: "", // Rol del usuario
            isActive: true, // Indicador de actividad del usuario
        },
    }),
    getters: {
        isAuthenticated(state) {
            return !!state.user.id; // Verifica si el usuario está autenticado
        },
        isRole: (state) => (role) => state.user.role === role, // Getter dinámico para roles
    },
    actions: {
        async login(email, password) {
            try {
                console.log("Iniciando sesión con:", { email });
                const response = await axios.post(
                    "http://localhost:3300/api/auth/login",
                    { email, password },
                    { headers: { "Content-Type": "application/json" } }
                );

                if (response.status === 200) {
                    console.log("Autenticación exitosa:", response.data);
                    this.user = response.data; // Actualiza el estado del usuario
                    localStorage.setItem("userId", this.user.id);
                    localStorage.setItem("isLoggedIn", "true");
                } else {
                    throw new Error("Error en la autenticación: Usuario no encontrado o inactivo.");
                }
            } catch (error) {
                console.error(
                    "Error al iniciar sesión:",
                    error.response?.data || error.message || error
                );
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
                console.log("Obteniendo datos del usuario con ID:", userId);
                const response = await axios.get("http://localhost:3300/users");

                if (response.status === 200) {
                    const user = response.data.find((u) => u.id === userId);
                    if (user) {
                        this.user = user; // Actualiza el estado con los datos del usuario
                        console.log("Usuario obtenido:", user);
                    } else {
                        console.warn("Usuario no encontrado en los datos.");
                    }
                } else {
                    console.warn("Error al obtener el usuario: Respuesta inesperada.");
                }
            } catch (error) {
                console.error(
                    "Error al obtener los datos del usuario:",
                    error.response?.data || error.message || error
                );
            }
        },
        async updateUser(user) {
            try {
                console.log("Actualizando usuario:", user);
                const response = await axios.put(`http://localhost:3300/users/${user.id}`, user);

                if (response.status === 200) {
                    this.user = response.data; // Actualiza el estado del usuario
                    console.log("Usuario actualizado con éxito:", response.data);
                } else {
                    throw new Error("Error al actualizar el usuario.");
                }
            } catch (error) {
                console.error(
                    "Error al actualizar el usuario:",
                    error.response?.data || error.message || error
                );
                throw error;
            }
        },
        async updateAvatar(avatar) {
            try {
                console.log("Actualizando avatar del usuario.");
                const response = await axios.put(`http://localhost:3300/users/${this.user.id}`, {
                    ...this.user,
                    avatar,
                });

                if (response.status === 200) {
                    this.user.avatar = response.data.avatar; // Actualiza solo el avatar
                    console.log("Avatar actualizado con éxito.");
                } else {
                    throw new Error("Error al actualizar el avatar.");
                }
            } catch (error) {
                console.error(
                    "Error al actualizar el avatar:",
                    error.response?.data || error.message || error
                );
                throw error;
            }
        },
        async updatePassword(newPassword) {
            try {
                console.log("Actualizando contraseña del usuario.");
                const response = await axios.put(`http://localhost:3300/users/${this.user.id}`, {
                    ...this.user,
                    password: newPassword,
                });

                if (response.status === 200) {
                    console.log("Contraseña actualizada correctamente.");
                    alert("Contraseña actualizada correctamente.");
                } else {
                    throw new Error("Error al actualizar la contraseña.");
                }
            } catch (error) {
                console.error(
                    "Error al actualizar la contraseña:",
                    error.response?.data || error.message || error
                );
                alert("No se pudo actualizar la contraseña.");
                throw error;
            }
        },
        logout() {
            console.log("Cerrando sesión del usuario.");
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
