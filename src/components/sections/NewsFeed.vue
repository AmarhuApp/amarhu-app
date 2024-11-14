<template>
  <div class="news-feed">
    <h2 class="news-title">Últimas Noticias</h2>
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="post-image" v-if="post.image">
        <img :src="post.image" alt="Post image" />
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
export default {
  name: "NewsFeed",
  data() {
    return {
      posts: [
        {
          id: 1,
          title: "Noticia 1",
          content: "Contenido de la noticia 1...",
          liked: false,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 2,
          title: "Noticia 2",
          content: "Contenido de la noticia 2...",
          liked: false,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 3,
          title: "Noticia 3",
          content: "Contenido de la noticia 3...",
          liked: false,
        },
      ],
    };
  },
  methods: {
    toggleLike(post) {
      post.liked = !post.liked;
    },
  },
};
</script>

<style scoped>
.news-feed {
  width: 370px;
  background-color: #ffffff;
  padding: 20px;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
}

.news-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

.post {
  display: flex;
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.post-image img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  margin-right: 10px;
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
