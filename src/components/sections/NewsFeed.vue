<template>
  <div class="news-feed">
    <h2 class="news-title">Avisos</h2>
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="post-image" v-if="post.image">
        <img :src="post.image" alt="Imagen de la noticia" />
      </div>
      <div class="post-content">
        <div class="post-header">
          <h3>{{ post.title }}</h3>
          <button class="like-button" @click="toggleLike(post)">
            <span :class="{ liked: post.liked }">♥</span>
          </button>
        </div>
        <p>{{ post.content }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "NewsFeed",
  data() {
    return {
      posts: [], // Inicialmente vacío para rellenar desde la API
      baseURL: "https://api.pa-reporte.com", // URL base de producción
    };
  },
  methods: {
    async fetchNews() {
      try {
        const response = await axios.get(`${this.baseURL}/api/noticias`);
        this.posts = response.data.map((post) => ({
          ...post,
          liked: false, // Agrega el estado `liked` por defecto
        }));
      } catch (error) {
        console.error("Error al cargar noticias:", error.message);
      }
    },
    toggleLike(post) {
      post.liked = !post.liked;
    },
  },
  created() {
    this.fetchNews();
  },
};
</script>

<style scoped>
.news-feed {
  width: 370px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease-in-out;
}

/* Ocultar en pantallas pequeñas */
@media (max-width: 768px) {
  .news-feed {
    display: none;
  }
}

@media (max-width: 1024px) {
  .news-feed {
    display: none;
  }
}

.news-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.post {
  display: flex;
  background-color: rgba(250, 250, 250, 0.95);
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
}

.post:hover {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.post-image img {
  width: 120px;
  height: 80px;
  border-radius: 5px;
  margin-right: 10px;
  object-fit: cover;
}

.post-content {
  flex: 1;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.post p {
  margin: 8px 0 0;
  color: #555;
  font-size: 14px;
}

.like-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #ccc;
  transition: color 0.3s;
}

.like-button .liked {
  color: red;
}
</style>

