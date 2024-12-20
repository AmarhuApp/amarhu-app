import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
    state: () => ({
        user: {
            id: null,
            name: "",
            email: "",
            avatar: "",
            password: "", // Included temporarily for password logic
        },
    }),
    getters: {
        isAuthenticated(state) {
            return !!state.user.id; // Check if the user is logged in
        },
    },
    actions: {
        async fetchUser(userId) {
            try {
                const response = await axios.get(`http://localhost:3000/users/${userId}`);
                if (response.status === 200) {
                    this.user = response.data;
                } else {
                    throw new Error("Error fetching user data.");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        },
        async updateUser(user) {
            try {
                const response = await axios.put(`http://localhost:3000/users/${user.id}`, user);
                if (response.status === 200) {
                    this.user = response.data;
                } else {
                    throw new Error("Error updating user.");
                }
            } catch (error) {
                console.error("Error updating user:", error);
            }
        },
        async updateAvatar(avatar) {
            try {
                const response = await axios.put(`http://localhost:3000/users/${this.user.id}`, {
                    ...this.user,
                    avatar,
                });
                if (response.status === 200) {
                    this.user.avatar = response.data.avatar;
                } else {
                    throw new Error("Error updating avatar.");
                }
            } catch (error) {
                console.error("Error updating avatar:", error);
            }
        },
        async updatePassword(currentPassword, newPassword) {
            try {
                if (this.user.password !== currentPassword) {
                    alert("La contraseña actual no es correcta.");
                    throw new Error("Contraseña incorrecta");
                }

                const response = await axios.put(`http://localhost:3000/users/${this.user.id}`, {
                    ...this.user,
                    password: newPassword,
                });
                if (response.status === 200) {
                    this.user.password = newPassword;
                    alert("Contraseña actualizada correctamente.");
                } else {
                    throw new Error("Error updating password.");
                }
            } catch (error) {
                console.error("Error updating password:", error);
                alert("No se pudo actualizar la contraseña.");
            }
        },
        logout() {
            this.user = {
                id: null,
                name: "",
                email: "",
                avatar: "",
                password: "",
            };
            localStorage.removeItem("user"); // Clear user session from local storage
        },
    },
});
