<template>
  <div id="app">
    <!-- Esperar a que la sesión esté lista -->
    <router-view v-if="ready" />
  </div>
</template>

<script>
import { waitForAuth } from "@/utils/authReady";

export default {
  name: "App",
  data() {
    return {
      ready: false,
    };
  },
  async mounted() {
    // Esperar a que el token esté listo antes de montar las rutas
    await waitForAuth();
    this.ready = true;
  },
};
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  overflow-x: auto;
  overflow-y: auto;
}

* {
  box-sizing: border-box; /* 💡 evita que padding/margin rompa el diseño */
}


#app {
  display: flex;
  flex-direction: column;
  min-height: 100%; /* ✅ Clave para cubrir toda la pantalla */
  background-color: #f9f9f9;
  box-sizing: border-box;
}

body > div:empty {
  display: none !important;
}
</style>
