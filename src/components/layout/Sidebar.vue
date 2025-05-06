<template>
  <div>
    <!-- Botón del menú de hamburguesa -->
    <button class="hamburger-menu" @click="toggleSidebar">
      <span v-if="!isHidden" class="material-icons">expand_more</span>
      <span v-else class="material-icons">menu</span>
    </button>

    <!-- Sidebar -->
    <div :class="['sidebar', { 'collapsed': isCollapsed, 'hidden': isHidden }]">
      <ul>
        <li>
          <router-link to="/" class="nav-link" exact-active-class="active-link">
            <span class="material-icons icon">home</span>
            <span v-if="!isCollapsed">Inicio</span>
          </router-link>
        </li>
        <li v-if="!isEmpleado">
          <router-link to="/posts"    class="nav-link"   active-class="active-link">
            <span class="material-icons icon">article</span>
            <span v-if="!isCollapsed">Avisos</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reports"    class="nav-link"   active-class="active-link">
            <span class="material-icons icon">description</span>
            <span v-if="!isCollapsed">Detalles de Producción</span>
          </router-link>
        </li>
        <li>
          <router-link to="/statistics"    class="nav-link"   active-class="active-link">
            <span class="material-icons icon">bar_chart</span>
            <span v-if="!isCollapsed">Estadísticas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/Settings"    class="nav-link"   active-class="active-link">
            <span class="material-icons icon">trending_up</span>
            <span v-if="!isCollapsed">Tendencias</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "@/store/user";

export default {
  name: "Sidebar",
  data() {
    return {
      isCollapsed: false,
      isHidden: false,
      userStore: useUserStore(),
    };
  },
  computed: {
    isEmpleado() {
      return ["REDACTOR", "LOCUTOR", "EDITOR", "PANELISTA"].includes(this.userStore.user.role);
    }
  },
  methods: {
    toggleSidebar() {
      this.isHidden = !this.isHidden;
      if (!this.isHidden) {
        this.isCollapsed = false;
      }
    },
    handleResize() {
      if (window.innerWidth > 1024) {
        this.isHidden = false;
        this.isCollapsed = false;
      }
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>

<style scoped>
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 1px 0 1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, opacity 0.3s ease;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar.hidden {
  transform: translateY(-100%);
  opacity: 0;
  pointer-events: none;
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin: 15px 0;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  font-size: 16px;
  transition: color 0.3s ease;
}

.sidebar a:hover {
  color: #ff0000;
}

.icon {
  margin-right: 10px;
  font-size: 24px;
  color: #666;
}

.sidebar.collapsed .icon {
  margin-right: 0;
  text-align: center;
}

.hamburger-menu {
  display: none;
  position: fixed;
  left: 0;
  top: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 1000;
  padding: 10px;
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.hamburger-menu .material-icons {
  font-size: 24px;
  color: #333;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 60px;
  }

  .sidebar ul {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sidebar li {
    margin: 20px 0;
  }

  .hamburger-menu {
    display: block;
  }

  .sidebar a span:not(.icon) {
    display: none;
  }
}

@media (max-width: 768px) {
  .hamburger-menu {
    display: block;
  }

  .sidebar.hidden {
    transform: translateX(-100%);
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
  }

  .sidebar ul {
    flex-direction: column;
  }

  .sidebar li {
    margin: 20px 0;
  }
}

.nav-link.active-link {
  background-color: #f0f0f0; /* Color de fondo resaltado */
  border-radius: 8px;
  font-weight: bold;
  color: #007bff; /* Color de texto activo */
}

.nav-link.active-link .icon {
  color: #007bff;
}
@media (max-width: 1024px) {
  .nav-link.active-link {
    background-color: transparent;
    color: #007bff;
  }

  .nav-link.active-link .icon {
    color: #007bff;
  }
}
</style>
