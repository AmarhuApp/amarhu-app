<template>
  <div class="trends">
    <h2>Trends</h2>

    <div class="tab-container">
      <button :class="{ active: activeTab === 'rpm' }" @click="activeTab = 'rpm'">Top 15 por RPM</button>
      <button :class="{ active: activeTab === 'views' }" @click="activeTab = 'views'">Top 15 por Vistas</button>
    </div>

    <table v-if="activeTab === 'rpm'" class="trends-table">
      <thead>
      <tr>
        <th>#</th>
        <th>Video ID</th>
        <th>Fecha</th>
        <th>RPM</th>
        <th>Título</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(video, index) in topRpmVideos" :key="video.videoId">
        <td>{{ index + 1 }}</td>
        <td>{{ video.videoId }}</td>
        <td>{{ formatDate(video.date) }}</td>
        <td class="highlight">{{ (video.rpm * 0.9).toFixed(2) }}</td>
        <td>{{ video.title }}</td>
      </tr>
      </tbody>
    </table>

    <table v-if="activeTab === 'views'" class="trends-table">
      <thead>
      <tr>
        <th>#</th>
        <th>Video ID</th>
        <th>Fecha</th>
        <th>Vistas</th>
        <th>Título</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(video, index) in topViewVideos" :key="video.videoId">
        <td>{{ index + 1 }}</td>
        <td>{{ video.videoId }}</td>
        <td>{{ formatDate(video.date) }}</td>
        <td class="highlight">{{ video.views }}</td>
        <td>{{ video.title }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Trends',
  data() {
    return {
      activeTab: 'rpm',
      allVideos: [],
      topRpmVideos: [],
      topViewVideos: [],
      baseURL: 'https://api.pa-reporte.com',
    };
  },
  methods: {
    async fetchVideos() {
      try {
        const { data } = await axios.get(`${this.baseURL}/api/videos`);
        this.allVideos = data;

        this.topRpmVideos = [...data]
            .filter(v => v.rpm != null)
            .sort((a, b) => b.rpm - a.rpm)
            .slice(0, 15);

        this.topViewVideos = [...data]
            .filter(v => v.views != null)
            .sort((a, b) => b.views - a.views)
            .slice(0, 15);
      } catch (error) {
        console.error('Error cargando videos:', error);
      }
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-PE');
    }
  },
  mounted() {
    this.fetchVideos();
  }
};
</script>

<style scoped>
.highlight {
  font-weight: bold;
  color: #007bff;
  background-color: #e8f0fe;
  border-radius: 6px;
}
.trends {
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

h2 {
  font-size: 22px;
  margin-bottom: 20px;
  color: #2a2a2a;
  font-weight: bold;
}

.tab-container {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.tab-container button {
  padding: 10px 20px;
  font-weight: 600;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.tab-container button:hover {
  background-color: #e6e6e6;
}

.tab-container button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

.trends-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  color: #222;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;
}

.trends-table th,
.trends-table td {
  padding: 12px 14px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
}

.trends-table th {
  background-color: #f0f0f0;
  font-weight: 700;
  color: #222;
}

.trends-table tr:nth-child(even) {
  background-color: #fafafa;
}

.trends-table tr:hover {
  background-color: #f5f5f5;
}
</style>

