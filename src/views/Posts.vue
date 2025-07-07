<template>
  <div class="posts-container">
    <div class="newsfeed">
      <div v-for="post in posts" :key="post.id" class="post-card">
        <h3 class="post-title">{{ post.title }}</h3>

        <div class="post-date">{{ formatDate(post.date) }}</div>

        <div v-if="post.image" class="post-image-container">
          <img :src="post.image" alt="Post Image" class="post-image" />
        </div>

        <p class="post-content" :class="{ 'large-text': !post.image }">{{ post.content }}</p>

        <div class="post-footer">
          <button class="reaction-button" @click="toggleReaction(post)">
            <span class="material-icons" :class="{ liked: post.liked }">
              favorite
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '@/store/user'; // IMPORTANTE: agrega esto

export default {
  name: "Posts",
  data() {
    return {
      posts: [], // Almacena las noticias obtenidas de la API
      baseURL: "https://api.pa-reporte.com", // URL base de producción
    };
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    isDirectivo() {
      return this.userStore.user.role === "DIRECTIVO";
    },
  },
  methods: {
    async fetchPosts() {
      try {
        const response = await axios.get(`${this.baseURL}/api/noticias`);
        const orderedPosts = response.data.sort((a, b) => {
          if (a.id === 4) return -1;
          if (b.id === 4) return 1;
          return new Date(b.date) - new Date(a.date);
        });

        this.posts = orderedPosts.map((post) => ({
          ...post,
          liked: false,
        }));
      } catch (error) {
        console.error("Error al obtener las noticias:", error);
      }
    },
    toggleReaction(post) {
      post.liked = !post.liked;
    },
    formatDate(date) {
      const now = new Date();
      const postDate = new Date(date);
      const diffTime = Math.abs(now - postDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffHours === 0 && diffMinutes < 60) {
          return "Hoy";
        } else if (diffHours === 1) {
          return "Hace 1 hora";
        } else if (diffHours > 1) {
          return `Hace ${diffHours} horas`;
        }
      } else if (diffDays === 1) {
        return "Ayer";
      } else if (diffDays <= 7) {
        return `Hace ${diffDays} días`;
      } else {
        return postDate.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      }
    },
  },
  mounted() {
    this.fetchPosts();
  },
};
</script>


<style scoped>
.posts-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 10px;
}

.newsfeed {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-card {
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  padding: 15px;
}

.post-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.post-date {
  font-size: 14px;
  color: #888;
  margin-bottom: 15px;
}

.post-image-container {
  width: 100%;
}

.post-image {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 10px;
}

.post-content {
  font-size: 18px;
  color: #555;
  margin: 15px 0;
}

.post-content.large-text {
  font-size: 22px;
  color: #333;
}

.post-footer {
  display: flex;
  justify-content: flex-start; /* Alineación a la izquierda */
  align-items: center;
  padding: 10px 0 0 0; /* Margen superior */
  width: 100%;
}

.reaction-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  margin: 0;
}

.reaction-button .material-icons {
  font-size: 24px;
  color: #666;
  transition: color 0.3s ease;
}

.reaction-button .material-icons.liked {
  color: #ff0000;
}
</style>