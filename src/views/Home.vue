<template>
  <div class="home">
    <Header />
    <div class="content-wrapper">
      <Sidebar />
      <div class="main-content">
        <LastVideoPerformance v-if="isHomeRoute" />
        <router-view v-else />
      </div>
      <LastVideoPreview v-if="isPostsRoute" />
      <NewsFeed v-else-if="isNewsFeedVisible" />
    </div>
  </div>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import NewsFeed from "@/components/sections/NewsFeed.vue";
import LastVideoPerformance from "@/components/sections/LastVideoPerformance.vue";
import LastVideoPreview from "@/components/sections/LastVideoPreview.vue"; // Nuevo componente
import axios from "axios";
import { useRoute } from "vue-router";

export default {
  name: "Home",
  components: {
    Header,
    Sidebar,
    NewsFeed,
    LastVideoPerformance,
    LastVideoPreview, // Agregado el nuevo componente
  },
  data() {
    return {
      totalVideos: 0,
      baseURL: "https://api.pa-reporte.com", // URL base de producción
    };
  },
  computed: {
    isHomeRoute() {
      const route = useRoute();
      return route.path === "/";
    },
    isPostsRoute() {
      const route = useRoute();
      return route.path === "/posts";
    },
    isNewsFeedVisible() {
      const route = useRoute();
      return route.path !== "/reports" && route.path !== "/statistics";
    },
  },
  created() {
    this.fetchProductionData(); // Llama a la API al cargar el componente
  },
  methods: {
    async fetchProductionData() {
      try {
        const response = await axios.get(`${this.baseURL}/api/production`);
        const data = response.data;

        // Actualizamos el total de videos desde la API
        this.totalVideos = data.totalVideos;

        // Puedes actualizar aquí otros datos si los necesitas
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error);
      }
    },
  },
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

.content-wrapper {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0; /* ⚠️ sin esto, el contenido puede empujar hacia los lados */
}


h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}

.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #ffffff; /* Fondo blanco */
}
</style>