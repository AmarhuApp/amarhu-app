<template>
  <div class="header">
    <div class="title" :class="{ centered: isMobile, leftAligned: !isMobile }">
      {{ isMobile ? "Amarhu" : "Amarhu - Prensa Alternativa El Jota" }}
    </div>
    <div class="user-section">
      <img src="../../assets/logo-jota.png" alt="User Icon" class="user-icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      isMobile: window.innerWidth <= 768, // Define si es móvil al cargar
    };
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth <= 768; // Actualiza isMobile al cambiar tamaño
    },
  },
  mounted() {
    window.addEventListener("resize", this.handleResize); // Escucha cambios en el tamaño
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize); // Limpia el listener
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
}

.user-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
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
