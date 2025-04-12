<template>
  <div class="header">
    <div class="title" :class="{ centered: isMobile, leftAligned: !isMobile }">
      {{ isMobile ? "Amarhu" : "Amarhu - Prensa Alternativa El Jota" }}
    </div>
    <div class="user-section">
      <!-- Avatar dinámico con menú desplegable -->
      <img
          :src="userAvatar"
          alt="User Icon"
          class="user-icon"
          @click="toggleMenu"
      />
      <!-- Menú desplegable -->
      <div v-if="showMenu" class="dropdown-menu">
        <button @click="redirectToUserProfile">Perfil de Usuario</button>
        <button @click="logout">Cerrar Sesión</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Header",
  data() {
    return {
      isMobile: window.innerWidth <= 768,
      userId: 2, // ID único del usuario
      userAvatar: "/assets/default-avatar.png", // Imagen de avatar por defecto
      showMenu: false, // Estado para mostrar u ocultar el menú desplegable
      baseURL: "https://api.pa-reporte.com", // URL base de producción
    };
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 768;
    },
    async fetchUserData() {
      try {
        const response = await axios.get(`${this.baseURL}/api/user`); // Utilizando /api/user
        const user = response.data;
        if (user && user.avatar) {
          this.userAvatar = user.avatar;
        } else {
          console.warn("Avatar no encontrado, se usará el predeterminado.");
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      }
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    redirectToUserProfile() {
      this.$router.push({ name: "UserProfile" });
      this.showMenu = false; // Oculta el menú después de redirigir
    },
    logout() {
      localStorage.removeItem("isLoggedIn"); // Limpia la sesión
      this.$router.push({ name: "Login" });
      this.showMenu = false; // Oculta el menú después de cerrar sesión
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.fetchUserData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
.header {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 15px 25px;
  background-color: #ffffff;
  color: #333333;
  box-sizing: border-box;
  border-bottom: 1px solid #e0e0e0;
  position: relative; /* Necesario para posicionar el ícono a la derecha */
}

.title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #333333;
  transition: all 0.3s ease; /* Animación suave para cambios */
}

.title.centered {
  text-align: center; /* Centra el texto cuando es móvil */
  margin: 0 auto; /* Asegura el centrado horizontal */
}

.title.leftAligned {
  text-align: left; /* Alinea el texto a la izquierda */
  margin: 0; /* Elimina margen adicional */
}

.user-section {
  position: absolute; /* Asegura que el ícono esté fuera del flujo principal */
  right: 20px; /* Posición fija a la derecha */
  top: 50%; /* Centra verticalmente */
  transform: translateY(-50%); /* Ajuste para centrar */
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  object-fit: cover; /* Asegura que la imagen se ajuste correctamente */
}

.user-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 60px; /* Espaciado debajo del avatar */
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 150px;
  text-align: left;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 10px;
  background: none;
  border: none;
  text-align: left;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dropdown-menu button:hover {
  background-color: #f5f5f5;
}

@media (max-width: 1024px) {
  .header {
    padding: 10px 15px;
  }

  .title {
    font-size: 18px;
  }

  .user-icon {
    width: 35px;
    height: 35px;
  }
}
</style>
