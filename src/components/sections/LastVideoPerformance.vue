<template>
  <div class="video-performance">
    <h3>Rendimiento del último video</h3>
    <div class="video-thumbnail">
      <img :src="video.thumbnail" alt="Último video" />
      <div class="video-title">{{ video.title }}</div>
    </div>
    <p class="video-details">{{ video.publishDate }} desde la publicación:</p>
    <ul>
      <li>
        <span class="label">Visualizaciones:</span>
        <span class="value">{{ video.views }}</span>
      </li>
      <li>
        <span class="label">Porcentaje de clics de las impresiones:</span>
        <span class="value">{{ video.clickThroughRate }}%</span>
      </li>
      <li>
        <span class="label">Duración media de las visualizaciones:</span>
        <span class="value">{{ video.averageWatchDuration }}</span>
      </li>
    </ul>
    <button @click="goToStatistics">Ir a las estadísticas del video</button>
  </div>
</template>

<script>
export default {
  name: "LastVideoPerformance",
  props: {
    video: {
      type: Object,
      required: true,
    },
  },
  methods: {
    goToStatistics() {
      this.$router.push("/statistics");
    },
  },
};
</script>

<style scoped>
.video-performance {
  background-color: #f9f9f9;
  color: #333;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.video-thumbnail {
  position: relative;
}

.video-thumbnail img {
  width: 100%;
  border-radius: 8px;
}

.video-title {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
}

.video-details {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

ul {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  color: #000000;
}

.value {
  font-weight: 600;
  color: #333;
}

button {
  background-color: #eaeaea;
  color: #000;
  padding: 10px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  max-width: 300px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #d0d0d0;
}

h3 {
  font-weight: 600;
}
</style>

