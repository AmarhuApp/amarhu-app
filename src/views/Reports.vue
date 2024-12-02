<template>
  <div class="reports">
    <h1>Reportes de Videos Producidos</h1>
    <div class="summary">
      <span>Total de Videos: {{ totalVideos }}</span>
    </div>
    <table class="reports-table">
      <thead>
      <tr>
        <th>#</th>
        <th>Miniatura</th>
        <th>ID</th>
        <th>Descripción</th>
        <th>Fecha</th>
        <th>Visualizaciones</th>
        <th>Revenue Estimado</th>
        <th>Revenue por Anuncios</th>
        <th>Duración Promedio de Vista</th>
        <th>RPM</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(video, index) in videos" :key="video.id">
        <td>{{ index + 1 }}</td>
        <td>
          <img :src="video.thumbnail" alt="Miniatura" class="thumbnail" />
        </td>
        <td>{{ video.id }}</td>
        <td>{{ video.description }}</td>
        <td>{{ video.date }}</td>
        <td>{{ video.views }}</td>
        <td>{{ video.estimatedRevenue }}</td>
        <td>{{ video.estimatedAdRevenue }}</td>
        <td>{{ video.averageViewDuration }}</td>
        <td>{{ video.rpm }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Reports",
  data() {
    return {
      totalVideos: 0,
      videos: [],
    };
  },
  created() {
    this.fetchReportData();
  },
  methods: {
    async fetchReportData() {
      try {
        const response = await axios.get("http://localhost:3000/videos");
        const data = response.data;

        this.totalVideos = data.length;
        this.videos = data;
      } catch (error) {
        console.error("Error al obtener los datos de reportes:", error);
      }
    },
  },
};
</script>

<style scoped>
.reports {
  padding: 20px;
}

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.summary {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #555;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.reports-table th,
.reports-table td {
  padding: 12px 15px;
  text-align: left;
  color: #181818;
}

.reports-table thead th {
  background-color: #f5f5f5;
  font-size: 16px;
  font-weight: 600;
  color: #555;
}

.reports-table tbody tr {
  border-bottom: 1px solid #eee;
}

.reports-table tbody tr:hover {
  background-color: #f9f9f9;
}

.thumbnail {
  width: 130px;
  height: auto;
  border-radius: 10px;
}
</style>
