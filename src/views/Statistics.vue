<template>
  <div class="statistics">
    <h1>Estadísticas</h1>
    <div class="charts">
      <div class="chart" id="chart1">
        <canvas ref="chart1"></canvas>
      </div>
      <div class="chart" id="chart2">
        <canvas ref="chart2"></canvas>
      </div>
      <div class="chart" id="chart3">
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
        <td class="rank">{{ index + 1 }}</td>
        <td class="name">{{ producer.name }}</td>
        <td class="video-count">{{ producer.videoCount }}</td>
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
              backgroundColor: ["#3E95CD", "#FF6384"],
              hoverBackgroundColor: ["rgba(62,149,205,0.76)", "rgba(255,99,132,0.82)"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: "Ganancias por Mes (S/.)",
              font: { size: 16 },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Ganancias (S/.)" },
              grid: { color: "#E0E0E0" },
            },
            x: {
              title: { display: true, text: "Mes" },
              grid: { display: false },
            },
          },
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
              fill: true,
              backgroundColor: "rgba(62, 149, 205, 0.2)",
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: "Duración Promedio de Vista (segundos)",
              font: { size: 16 },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Segundos" },
              grid: { color: "#E0E0E0" },
            },
            x: {
              title: { display: true, text: "Fecha" },
              grid: { display: false },
            },
          },
        },
      });

      // Gráfica 3: Ganancias vs Coste de Producción
      new Chart(this.$refs.chart3, {
        type: "doughnut",
        data: {
          labels: ["Ganancias Netas", "Coste Total de Producción"],
          datasets: [
            {
              data: [
                this.resumenProduccion.gananciaNeta,
                this.resumenProduccion.costeTotalProduccion,
              ],
              backgroundColor: ["#FF6384", "#36A2EB"],
              hoverBackgroundColor: ["#FF4D6A", "#2B90E4"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "top" },
            title: {
              display: true,
              text: "Ganancias vs Coste de Producción",
              font: { size: 16 },
            },
          },
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
  padding: 5px;
}

h1{
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
  padding-top: 20px;
}

.charts {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-between;
}

.chart {
  flex: 1;
  min-width: 320px;
  max-width: 450px;
  height: 350px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chart h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #444;
  text-align: center;
}

.top-producers-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin-top: 20px;
  background-color: rgb(255, 255, 255); /* Fondo oscuro */
  color: #333333; /* Texto claro */
  border-radius: 8px; /* Bordes redondeados */
  overflow: hidden; /* Oculta bordes */
}


.top-producers-table thead {
  background-color: rgba(234, 234, 234, 0.27); /* Fondo ligeramente más claro */
}

.top-producers-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  border-bottom: 1px solid #444444; /* Línea de separación */
}

.top-producers-table tbody tr {
  transition: background-color 0.2s ease;
}

.top-producers-table tbody tr:hover {
  background-color: #ffffff; /* Efecto hover */
}

.top-producers-table td {
  padding: 12px 16px;
  font-size: 14px;
  color: #ffffff;
  border-bottom: 1px solid rgba(68, 68, 68, 0.42); /* Líneas entre filas */
}

.top-producers-table .rank {
  color: #333333; /* Número menos destacado */
}

.top-producers-table .name {
  font-weight: bold;
  color: #333333;
}

.top-producers-table .video-count {
  text-align: left;
  color: #333333;
}
</style>
