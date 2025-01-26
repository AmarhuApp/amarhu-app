<template>
  <div class="user-profile-container">

    <!-- Botón de Retroceso -->
    <button class="back-button" @click="goBack">
      ← Volver
    </button>

    <div class="user-profile">
      <h1>Perfil del Usuario</h1>

      <!-- Sección para cambiar Avatar -->
      <UserAvatar class="user-section" />

      <!-- Sección de Detalles del Usuario -->
      <UserDetails class="user-section" />

      <!-- Sección para cambiar Contraseña -->
      <UserPassword class="user-section" />
    </div>
  </div>
</template>

<script>
import UserDetails from "@/components/sections/UserDetails.vue";
import UserAvatar from "@/components/sections/UserAvatar.vue";
import UserPassword from "@/components/sections/UserPassword.vue";

export default {
  name: "UserProfile",
  components: {
    UserDetails,
    UserAvatar,
    UserPassword,
  },
  methods: {
    goBack() {
      this.$router.push("/");
    }
  }
};
</script>

<style scoped>
/* Solución: aplicar box-sizing para evitar desbordamiento */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Contenedor principal que ocupa todo el frontal */
.user-profile-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh; /* Ocupa toda la altura de la pantalla */
  width: 100%; /* Elimina posibles desbordes */
  background-color: #f9f9f9;
  padding: 20px;
  min-width: 98.9vw;
  box-sizing: border-box;
  overflow-x: hidden; /* Previene cualquier desbordamiento horizontal */
}

/* Botón de Retroceso */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  background: none;
  border: none;
  color: #007bff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
}

.back-button:hover {
  color: #0056b3;
  transform: translateX(-3px); /* Efecto de deslizamiento */
}

/* Diseño de la tarjeta del perfil */
.user-profile {
  display: flex;
  flex-direction: column; /* Apila los elementos en una columna */
  gap: 20px; /* Espacio entre secciones */
  background: #ffffff;
  padding: 20px; /* Ajuste en padding */
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px; /* Ancho máximo */
  box-sizing: border-box;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
}

/* Sección individual (Detalles, Avatar, Contraseña) */
.user-section {
  background-color: #f5f5f5;
  padding: 15px; /* Padding más ligero */
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  box-sizing: border-box; /* Garantiza que padding no influya en el ancho */
}

/* Diseño adaptable para pantallas pequeñas */
@media (max-width: 768px) {
  .user-profile {
    padding: 15px;
  }

  h1 {
    font-size: 20px;
  }
}
</style>
