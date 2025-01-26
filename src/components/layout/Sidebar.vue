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
          <router-link to="/">
            <span class="material-icons icon">home</span>
            <span v-if="!isCollapsed">Inicio</span>
          </router-link>
        </li>
        <li>
          <router-link to="/posts">
            <span class="material-icons icon">article</span>
            <span v-if="!isCollapsed">Avisos</span>
          </router-link>
        </li>
        <li>
          <router-link to="/statistics">
            <span class="material-icons icon">bar_chart</span>
            <span v-if="!isCollapsed">Estadisticas</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reports">
            <span class="material-icons icon">description</span>
            <span v-if="!isCollapsed">Reportes</span>
          </router-link>
        </li>
        <li>
          <router-link to="/settings">
            <span class="material-icons icon">settings</span>
            <span v-if="!isCollapsed">Configuraciones</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
export default {
  name: "Sidebar",
  data() {
    return {
      isCollapsed: false, // Estado para reducir el tamaño de la sidebar
      isHidden: false, // Estado para ocultar completamente la sidebar
    };
  },
  methods: {
    toggleSidebar() {
      this.isHidden = !this.isHidden; // Alternar entre ocultar y mostrar la sidebar
      if (!this.isHidden) {
        this.isCollapsed = false; // Asegurarse de expandir cuando se muestra
      }
    },
    handleResize() {
      if (window.innerWidth > 1024) {
        this.isHidden = false; // Mostrar la sidebar en pantallas grandes
        this.isCollapsed = false; // Expandir completamente
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
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 1px 0 1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, opacity 0.3s ease; /* Animación suave */
  height: 100%;
  top: 0;
  left: 0;
  z-index: 999;
}


.sidebar.collapsed {
  width: 60px;
}

.sidebar.hidden {
  transform: translateY(-100%); /* Mueve la sidebar hacia arriba */
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
</style>

