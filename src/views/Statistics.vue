<template>
  <div class="statistics">
    <div class="content-wrapper">
      <div class="main-content">
        <h1>Estadísticas</h1>

        <!-- Contenido exclusivo para empleados -->
        <div v-if="isEmpleado">
          <div class="tab-container">
            <button :class="{ active: activeTab === 'semana' }" @click="activeTab = 'semana'">Resumen semanal</button>
            <button :class="{ active: activeTab === 'mes' }" @click="activeTab = 'mes'">Resumen mensual</button>
          </div>

          <div class="chart" v-if="activeTab === 'semana'">
            <canvas ref="weeklyChart"></canvas>
          </div>
          <div class="weekly-summary" v-if="activeTab === 'semana' && weekSummary">
            <p>
              Total de videos producidos: {{ weekSummary.total }} |
              Caídos: {{ weekSummary.caidos }} |
              Comisión acumulada: {{ weekSummary.comision }} dólares USA
            </p>
            <p>{{ capitalize(weekSummary.mes) }}</p>
          </div>

          <div class="chart" v-if="activeTab === 'mes'">
            <canvas ref="monthlyChart"></canvas>
            <div class="monthly-summary" v-if="activeTab === 'mes' && monthSummary">
              <p>
                Total de videos producidos: {{ monthSummary.total }} |
                Caídos: {{ monthSummary.caidos }} |
                Comisión acumulada: {{ monthSummary.comision }} dólares USA
              </p>
              <p>{{ capitalize(monthSummary.mes) }}</p>
            </div>
          </div>
        </div>

        <!-- Contenido para directivos y otros roles -->
        <div v-else>
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
      </div>

      <!-- NewsFeed siempre visible al costado derecho -->
      <NewsFeed />
    </div>
  </div>
</template>



<script>
import Chart from "chart.js/auto";
import axios from "axios";
import { useUserStore } from "@/store/user";
import NewsFeed from "@/components/sections/NewsFeed.vue";
import { useRoute } from "vue-router";

export default {
  components: { NewsFeed },
  name: "Statistics",
  data() {
    return {
      monthSummary: null,
      weekSummary: null,
      weeklyChartInstance: null,
      monthlyChartInstance: null,
      resumenProduccion: null,
      resumenProduccionMesPasado: null,
      videos: [],
      topProducers: [],
      userStore: useUserStore(),
      activeTab: "semana",
      baseURL: "https://api.pa-reporte.com"
    };
  },
  computed: {
    isNewsFeedVisible() {
      const route = useRoute();
      return route.path !== "/reports" && route.path !== "/statistics";
    },
    isEmpleado() {
      return ["REDACTOR", "LOCUTOR", "EDITOR", "PANELISTA"].includes(this.userStore.user.role);
    }
  },
  watch: {
    activeTab(newTab) {
      if (this.isEmpleado) {
        this.$nextTick(() => {
          if (newTab === 'semana') this.renderWeeklyChart();
          if (newTab === 'mes') this.renderMonthlyChart();
        });
      }
    }
  },
  methods: {
    async fetchStatisticsData() {
      try {
        if (this.isEmpleado) {
          const { data } = await axios.get(`${this.baseURL}/api/personal-videos/${this.userStore.user.id}`);
          this.videos = data;
          this.$nextTick(() => {
            this.renderWeeklyChart();
            this.renderMonthlyChart();
          });
        } else {
          const resumen = await axios.get(`${this.baseURL}/api/production`);
          this.resumenProduccion = resumen.data;

          const resumenMesPasado = await axios.get(`${this.baseURL}/api/production-last-month`);
          this.resumenProduccionMesPasado = resumenMesPasado.data;

          const allVideos = await axios.get(`${this.baseURL}/api/videos`);
          this.videos = allVideos.data;

          const top = await axios.get(`${this.baseURL}/api/top-producers`);
          this.topProducers = top.data;

          this.$nextTick(() => {
            this.renderCharts();
          });
        }
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    },
    capitalize(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    getChartOptions(title, yLabel) {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top" },
          title: { display: true, text: title, font: { size: 16 } }
        },
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            max: 12,
            ticks: { stepSize: 1, precision: 0 },
            title: { display: true, text: yLabel },
            grid: { color: "#E0E0E0" }
          },
          x: { grid: { display: false } }
        }
      };
    },
    renderWeeklyChart() {
      if (this.weeklyChartInstance) this.weeklyChartInstance.destroy();

      const daysLabels = ["L", "M", "M", "J", "V", "S", "D"];
      const weekly = Array(7).fill(0);
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));

      let totalVideos = 0;
      let videosCaidos = 0;
      let comisionAcumulada = 0;

      this.videos.forEach((v) => {
        const date = new Date(v.date);
        const dayIndex = (date.getDay() + 6) % 7;
        const inThisWeek = date >= startOfWeek && date <= now;

        if (inThisWeek) {
          weekly[dayIndex]++;
          totalVideos++;
          if (v.estado === "CAIDO") videosCaidos++;
          comisionAcumulada += v.comision || 0;
        }
      });

      const chartOptions = this.getChartOptions("Videos producidos por día de la semana", "Videos producidos");

      this.weeklyChartInstance = new Chart(this.$refs.weeklyChart, {
        type: "line",
        data: {
          labels: daysLabels,
          datasets: [{
            label: "Videos por día",
            data: weekly,
            borderColor: "#f4a261",
            backgroundColor: "rgba(244, 162, 97, 0.3)",
            fill: true,
            tension: 0.3
          }]
        },
        options: chartOptions
      });

      this.weekSummary = {
        total: totalVideos,
        caidos: videosCaidos,
        comision: comisionAcumulada.toFixed(2),
        mes: new Date().toLocaleDateString("es-PE", { month: "long", year: "numeric" })
      };
    },
    renderMonthlyChart() {
      if (this.monthlyChartInstance) this.monthlyChartInstance.destroy();

      const today = new Date();
      const useLastMonth = today.getDate() <= 7;
      const monthToUse = useLastMonth ? today.getMonth() - 1 : today.getMonth();
      const yearToUse = useLastMonth && today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear();
      const daysInMonth = new Date(yearToUse, monthToUse + 1, 0).getDate();
      const monthlyAdjusted = Array(daysInMonth).fill(0);

      let totalMes = 0;
      let caidosMes = 0;
      let comisionMes = 0;

      this.videos.forEach((v) => {
        const date = new Date(v.date);
        const sameMonth = date.getMonth() === monthToUse && date.getFullYear() === yearToUse;

        if (sameMonth) {
          const day = date.getDate() - 1;
          monthlyAdjusted[day]++;
          totalMes++;
          if (v.estado === "CAIDO") caidosMes++;
          comisionMes += v.comision || 0;
        }
      });

      const chartOptions = this.getChartOptions(`Videos producidos por día de ${useLastMonth ? 'mes pasado' : 'este mes'}`, "Videos producidos");

      this.monthlyChartInstance = new Chart(this.$refs.monthlyChart, {
        type: "line",
        data: {
          labels: monthlyAdjusted.map((_, i) => `${(i + 1).toString().padStart(2, "0")}`),
          datasets: [{
            label: "Videos por día",
            data: monthlyAdjusted,
            borderColor: "#2a9d8f",
            backgroundColor: "rgba(42, 157, 143, 0.3)",
            fill: true,
            tension: 0.3
          }]
        },
        options: chartOptions
      });

      this.monthSummary = {
        total: totalMes,
        caidos: caidosMes,
        comision: comisionMes.toFixed(2),
        mes: new Date(yearToUse, monthToUse).toLocaleDateString("es-PE", { month: "long", year: "numeric" })
      };
    },
    renderCharts() {
      // directivos y roles similares (sin cambios)
    }
  },
  created() {
    this.fetchStatisticsData();
  }
};
</script>



<style scoped>
.statistics {
  padding: 5px;
}

.content-wrapper {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.main-content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  overflow-x: hidden;
  min-width: 0;
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

.tab-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 20px;
}

.tab-container button {
  padding: 8px 16px;
  font-weight: bold;
  border: 1px solid #ccc;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
}

.tab-container button.active {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.chart {
  margin: 0 auto 20px;
  width: 100%;
  max-width: 700px;
  height: 400px;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  padding: 15px;
  border-radius: 10px;
}

.weekly-summary {
  text-align: center;
  font-size: 14px;
  color: #333333;
  margin-top: 10px;
}

.monthly-summary {
  text-align: center;
  font-size: 14px;
  color: #333333;
  margin-top: 10px;
}
</style>