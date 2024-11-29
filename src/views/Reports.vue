<template>
  <div class="reports">
    <h2>Reportes de Videos Producidos</h2>
    <table class="reports-table">
      <thead>
      <tr>
        <th>Número</th>
        <th>ID</th>
        <th>Descripción</th>
        <th>Fecha</th>
        <th>Visualizaciones</th>
        <th>Estimated Revenue</th>
        <th>Estimated Ad Revenue</th>
        <th>Views</th>
        <th>Average View Duration</th>
        <th>RPM</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(video, index) in videos" :key="index">
        <td>{{ index + 1 }}</td>
        <td>{{ video.id }}</td>
        <td>{{ video.description }}</td>
        <td>{{ video.date }}</td>
        <td>{{ video.views }}</td>
        <td>{{ video.estimatedRevenue }}</td>
        <td>{{ video.estimatedAdRevenue }}</td>
        <td>{{ video.videoViews }}</td>
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
  name: 'Reports',
  data() {
    return {
      videos: [], // Aquí almacenaremos los datos obtenidos del servidor
    };
  },
  mounted() {
    this.fetchVideos(); // Llama a la función cuando el componente se monte
  },
  methods: {
    async fetchVideos() {
      try {
        const response = await axios.get("http://localhost:3000/videos");
        this.videos = response.data; // Asigna los datos obtenidos al array de videos
        console.log("Datos de videos obtenidos del servidor:", this.videos);
      } catch (error) {
        console.error("Error al obtener los datos de videos:", error.message);
      }
    },
  },
};
</script>



<style scoped>
.reports {
  padding: 20px;
  background-color: #fff;
  color: #333;
}

h2 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-top: 10px;
}

.reports-table th,
.reports-table td {
  padding: 8px 10px;
  border: 1px solid #eaeaea;
  text-align: left;
}

.reports-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.reports-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.reports-table tr:hover {
  background-color: #eaeaea;
}
</style>
