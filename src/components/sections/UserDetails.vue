<template>
  <div class="user-details">
    <h2>Detalles del Usuario</h2>
    <form @submit.prevent="updateDetails">
      <div class="form-group">
        <label for="name">Nombre:</label>
        <input id="name" v-model="user.name" type="text" required />
      </div>

      <div class="form-group">
        <label for="email">Correo Electrónico:</label>
        <input id="email" v-model="user.email" type="email" required />
      </div>

      <button type="submit" class="save-button">Guardar Cambios</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserDetails",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      user: {
        id: null,
        name: "",
        email: "",
      },
    };
  },
  created() {
    this.fetchUserDetails();
  },
  methods: {
    async fetchUserDetails() {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("user")); // Obtener datos del usuario logueado
        if (loggedInUser) {
          const response = await axios.get(`http://localhost:3000/users/${loggedInUser.id}`);
          this.user = {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email || "usuario@email.com",
          };
        } else {
          alert("No se encontró información del usuario. Por favor, inicie sesión.");
          this.$router.push("/login");
        }
      } catch (error) {
        console.error("Error al cargar los detalles del usuario:", error);
      }
    },
    async updateDetails() {
      try {
        await axios.put(`http://localhost:3000/users/${this.user.id}`, {
          name: this.user.name,
          email: this.user.email,
        });
        alert("Detalles del usuario actualizados correctamente");
        // Actualiza los datos en `localStorage` después de guardar
        localStorage.setItem("user", JSON.stringify(this.user));
      } catch (error) {
        console.error("Error al actualizar los detalles del usuario:", error);
        alert("Ocurrió un error al actualizar los detalles.");
      }
    },
  },
};
</script>

<style scoped>
.user-details {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-details:hover {
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
  transition: border-color 0.3s ease;
}

input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.save-button {
  margin-top: 20px;
  padding: 12px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.save-button:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.save-button:active {
  transform: translateY(0);
  box-shadow: inset 0 3px 6px rgba(0, 0, 0, 0.2);
}
</style>
