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
export default {
  name: "UserPassword",
  data() {
    return {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  },
  methods: {
    changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        alert("Las contraseñas no coinciden.");
      } else {
        alert("Contraseña actualizada correctamente.");
        console.log("Nueva contraseña:", this.newPassword);
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
