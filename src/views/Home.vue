<template>
  <div class="home">
    <div class="header">
      <Header />
    </div>
    <div class="main-content">
      <Sidebar />
      <div class="news-section">
        <div class="news-title">
          <h2>Publicaciones Recientes</h2>
        </div>
        <div class="news-list">
          <NewsFeed />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Sidebar from "@/components/Sidebar.vue";
import NewsFeed from "@/components/NewsFeed.vue";

export default {
  name: "Home",
  components: {
    Header,
    Sidebar,
    NewsFeed,
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

.header {
  width: 100%;
  background-color: #333;
}

.main-content {
  display: flex;
  flex: 1;
}

Sidebar {
  width: 250px;
  min-width: 200px;
}

.news-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
}

.news-title {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
  padding-right: 20px;
}

.news-list {
  width: 80%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
}
</style>
