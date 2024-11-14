<template>
  <div class="home">
    <Header />
    <div class="content-wrapper">
      <Sidebar />
      <div class="main-content">
        <h2>Total de Videos: {{ totalVideos }}</h2>

        <LastVideoPerformance v-if="isHomeRoute" :video="lastVideo" />
        <router-view v-else />
      </div>
      <NewsFeed />
    </div>
  </div>
</template>

<script>
import Header from "@/components/layout/Header.vue";
import Sidebar from "@/components/layout/Sidebar.vue";
import NewsFeed from "@/components/sections/NewsFeed.vue";
import LastVideoPerformance from "@/components/sections/LastVideoPerformance.vue";
import { useRoute } from 'vue-router';

export default {
  name: "Home",
  components: {
    Header,
    Sidebar,
    NewsFeed,
    LastVideoPerformance,
  },
  data() {
    return {
      totalVideos: 10,
      lastVideo: {
        title: "Entrevista n°4",
        thumbnail: "https://via.placeholder.com/300x200",
        publishDate: "Hace 206 días",
        views: 3,
        clickThroughRate: 0,
        averageWatchDuration: "0:21",
      },
    };
  },
  computed: {
    isHomeRoute() {
      const route = useRoute();
      return route.path === '/';
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
  flex: 1;
  overflow: hidden;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #333;
}
</style>
