<template>
  <div class="statistics">
    <h1>Estadísticas</h1>
    <div class="charts">
      <div class="chart" id="chart1">
        <h3>Total de Ganancias por Mes</h3>
        <canvas ref="chart1"></canvas>
      </div>
      <div class="chart" id="chart2">
        <h3>Duración Promedio de Vista</h3>
        <canvas ref="chart2"></canvas>
      </div>
      <div class="chart" id="chart3">
        <h3>Ganancias vs Coste de Producción</h3>
        <canvas ref="chart3"></canvas>
      </div>
    </div>

    <h2>Top de Producción de Redactores</h2>
    <table class="top-producers-table">
      <thead>
      <tr>
        <th>#</th>
        <th>Nombre</th>
        <th>Videos Producidos</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(producer, index) in topProducers" :key="producer.id">
        <td>{{ index + 1 }}</td>
        <td>{{ producer.name }}</td>
        <td>{{ producer.videoCount }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import axios from "axios";

export default {
  name: "Statistics",
  data() {
    return {
      videos: [],
      resumenProduccion: null,
      resumenProduccionMesPasado: null,
      topProducers: [],
    };
  },
  methods: {
    async fetchStatisticsData() {
      try {
        // Obtener datos de producción general
        const resumenResponse = await axios.get("http://localhost:3000/resumenProduccion");
        this.resumenProduccion = resumenResponse.data;

        // Obtener datos de producción del mes pasado
        const resumenMesPasadoResponse = await axios.get("http://localhost:3000/resumenProduccionMesPasado");
        this.resumenProduccionMesPasado = resumenMesPasadoResponse.data;

        // Obtener lista de videos
        const videosResponse = await axios.get("http://localhost:3000/videos");
        this.videos = videosResponse.data;

        // Obtener top de redactores
        const producersResponse = await axios.get("http://localhost:3000/topProducers");
        this.topProducers = producersResponse.data;

        // Renderizar las gráficas después de obtener los datos
        this.renderCharts();
      } catch (error) {
        console.error("Error al obtener los datos de estadísticas:", error);
      }
    },
    renderCharts() {
      // Gráfica 1: Total de Ganancias por Mes
      new Chart(this.$refs.chart1, {
        type: "bar",
        data: {
          labels: ["Mes Pasado", "Este Mes"],
          datasets: [
            {
              label: "Ganancias (S/.)",
              data: [
                this.resumenProduccionMesPasado.gananciaTotal,
                this.resumenProduccion.gananciaTotal,
              ],
              backgroundColor: ["#4CAF50", "#FF9800"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      // Gráfica 2: Duración Promedio de Vista
      new Chart(this.$refs.chart2, {
        type: "line",
        data: {
          labels: this.videos.map((video) => video.date),
          datasets: [
            {
              label: "Duración Promedio (segundos)",
              data: this.videos.map((video) => video.averageViewDuration),
              borderColor: "#3E95CD",
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });

      // Gráfica 3: Ganancias vs Coste de Producción
      new Chart(this.$refs.chart3, {
        type: "pie",
        data: {
          labels: ["Ganancias Netas", "Coste Total de Producción"],
          datasets: [
            {
              data: [
                this.resumenProduccion.gananciaNeta,
                this.resumenProduccion.costeTotalProduccion,
              ],
              backgroundColor: ["#FF6384", "#36A2EB"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    },
  },
  created() {
    this.fetchStatisticsData();
  },
};
</script>

<style scoped>
.statistics {
  padding: 20px;
}

h1,
h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.chart {
  flex: 1;
  min-width: 300px;
  height: 300px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chart h3 {
  margin-bottom: 10px;
  font-size: 16px;
  color: #555;
}

.top-producers-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.top-producers-table th,
.top-producers-table td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #e0e0e0;
  color: #181818;
}

.top-producers-table thead th {
  background-color: #f5f5f5;
  font-size: 16px;
  font-weight: 600;
  color: #555;
}
</style>
