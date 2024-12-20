<template>
  <div class="user-password">
    <h2>Cambiar Contraseña</h2>
    <form @submit.prevent="changePassword">
      <div class="form-group">
        <label for="currentPassword">Contraseña Actual:</label>
        <input
            id="currentPassword"
            v-model="currentPassword"
            type="password"
            placeholder="Ingresa tu contraseña actual"
            required
        />
      </div>

      <div class="form-group">
        <label for="newPassword">Nueva Contraseña:</label>
        <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            placeholder="Ingresa tu nueva contraseña"
            required
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Nueva Contraseña:</label>
        <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirma tu nueva contraseña"
            required
        />
      </div>

      <button type="submit" class="save-button">Actualizar Contraseña</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserPassword",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  },
  methods: {
    async changePassword() {
      try {
        // Obtener el usuario logueado desde localStorage
        const loggedInUser = JSON.parse(localStorage.getItem("user"));
        if (!loggedInUser) {
          alert("No se encontró información del usuario. Por favor, inicie sesión.");
          this.$router.push("/login");
          return;
        }

        // Verificar la contraseña actual
        const response = await axios.get(`http://localhost:3000/users/${loggedInUser.id}`);
        const user = response.data;

        if (this.currentPassword !== user.password) {
          alert("La contraseña actual es incorrecta.");
          return;
        }

        if (this.newPassword !== this.confirmPassword) {
          alert("Las contraseñas no coinciden.");
          return;
        }

        // Actualizar la contraseña en la base de datos
        await axios.put(`http://localhost:3000/users/${loggedInUser.id}`, {
          ...user,
          password: this.newPassword,
        });

        alert("Contraseña actualizada correctamente.");
        this.currentPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
      } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        alert("Ocurrió un error al actualizar la contraseña.");
      }
    },
  },
};
</script>

<style scoped>
.user-password {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-password:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

h2 {
  font-size: 20px;
  color: #333;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-size: 14px;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 5px rgba(40, 167, 69, 0.3);
}

.save-button {
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.save-button:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.save-button:active {
  transform: translateY(0);
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.2);
}
</style>
