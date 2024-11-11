<template>
  <div class="news-feed">
    <div v-for="post in posts" :key="post.id" class="post">
      <div class="post-header">
        <h3>{{ post.title }}</h3>
        <button class="like-button" @click="toggleLike(post)">
          <span :class="{ liked: post.liked }">♥</span>
        </button>
      </div>
      <p>{{ post.content }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewsFeed",
  data() {
    return {
      posts: [
        { id: 1, title: "Noticia 1", content: "Contenido de la noticia 1...", liked: false },
        { id: 2, title: "Noticia 2", content: "Contenido de la noticia 2...", liked: false },
        { id: 3, title: "Noticia 3", content: "Contenido de la noticia 3...", liked: false },
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.post {
  background-color: #f9f9f9;
  padding: 20px;
  margin-bottom: 40px;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 600px;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.post p {
  margin: 10px 0 0;
  color: #555;
}

.like-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #ccc;
  transition: color 0.3s;
}

.like-button .liked {
  color: red;
}
</style>
