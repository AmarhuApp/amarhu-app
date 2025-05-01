<template>
  <div class="header">
    <!-- Parte izquierda: bienvenida y rol -->
    <div class="user-greeting">
      <div class="user-name">Hola {{ user.name }}</div>
      <div class="user-role">{{ roleDisplay }}</div>
    </div>

    <!-- Parte derecha: logos y menú -->
    <div class="branding">
      <div class="logo-group">
        <img src="/assets/logo-jota-2.png" alt="Prensa Alternativa El Jota" class="logo-prensa" />
        <img src="/assets/logo-metrix.png" alt="Metrix" class="logo-metrix" />
      </div>
      <div class="fecha">{{ currentDate }}</div>
    </div>

    <!-- Sección del avatar y menú -->
    <div class="user-section">
      <img
          :src="userAvatar"
          alt="User Icon"
          class="user-icon"
          @click="toggleMenu"
      />
      <div v-if="showMenu" class="dropdown-menu">
        <button @click="redirectToUserProfile">Perfil de Usuario</button>
        <button @click="logout">Cerrar Sesión</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/store/user';

export default {
  name: "Header",
  data() {
    return {
      showMenu: false,
      currentDate: new Date().toLocaleDateString("es-PE"),
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    user() {
      return this.userStore.user || {};
    },
    userAvatar() {
      return this.user.avatar || "/assets/default-avatar.png";
    },
    roleDisplay() {
      switch (this.user.role) {
        case "REDACTOR": return "Redactor asociado";
        case "DIRECTIVO": return "Miembro del Directorio";
        case "JEFE_REDACCION": return "Jefe de Redacción";
        case "JEFE_PRENSA": return "Jefe de Prensa";
        case "PANELISTA": return "Panelista";
        default: return this.user.role || "Usuario";
      }
    }
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    redirectToUserProfile() {
      this.$router.push({ name: "UserProfile" });
      this.showMenu = false;
    },
    logout() {
      localStorage.removeItem("isLoggedIn");
      this.$router.push({name: "Login"});
      this.showMenu = false;
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 15px 25px;
  background-color: #ffffff;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  position: relative;
}

.user-greeting {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 10px;
}

.user-name {
  font-size: 18px;
  color: #333;
}

.user-role {
  font-weight: bold;
  font-size: 18px;
  color: #222;
}

.branding {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* ✅ alinea hacia la derecha */
  margin-left: auto;
  margin-right: 100px; /* ✅ espacio para no chocar con el botón */
  text-align: right;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fecha {
  font-size: 16px;
  color: #000000;
  margin-top: 4px;
  margin-left: 3px;
}

.logo-prensa {
  height: 30px;
}

.logo-metrix {
  height: 34px;
  object-fit: contain;
}

.user-section {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.user-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: cover;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.user-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 60px;
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
  width: 150px;
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

@media (max-width: 768px) {
  .branding {
    justify-content: center;
    width: 100%;
    margin-top: 10px;
  }

  .user-section {
    position: static;
    transform: none;
    margin-top: 10px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
