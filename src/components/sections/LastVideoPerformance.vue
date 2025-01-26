<template>
  <div class="video-performance">
    <!-- Navegación de pestañas -->
    <div class="tab-container">
      <button
          :class="{ 'active-tab': activeTab === 'produccion' }"
          @click="activeTab = 'produccion'"
      >
        Resumen de Producción
      </button>
      <button
          v-if="isDirectivo || isJefePrensa"
          :class="{ 'active-tab': activeTab === 'jr' }"
          @click="activeTab = 'jr'"
      >
        Resumen JR's
      </button>
      <button
          v-if="isJefeRedaccion"
          :class="{ 'active-tab': activeTab === 'redactores' }"
          @click="activeTab = 'redactores'"
      >
        Redactores
      </button>
      <button
          v-if="isEmpleado"
          :class="{ 'active-tab': activeTab === 'topVideos' }"
          @click="activeTab = 'topVideos'"
      >
        Mis Mejores Videos
      </button>
    </div>

    <!-- Contenido de Resumen de Producción -->
    <div v-if="activeTab === 'produccion'">
      <h3>Resumen de Producción</h3>
      <div class="horizontal-container">
        <!-- Contenedor del resumen -->
        <div>
          <table v-if="productionData" class="production-table">
            <tbody>
            <tr>
              <td class="label">Total de Videos:</td>
              <td class="value">{{ productionData.totalVideos }}</td>
            </tr>
            <tr>
              <td class="label">Videos Caídos:</td>
              <td class="value">{{ productionData.videosCaidos }}</td>
            </tr>
            <tr>
              <td class="label">Ganancia Total:</td>
              <td class="value">{{ productionData.gananciaTotal }}</td>
            </tr>
            <tr>
              <td class="label">Ganancia menos impuestos:</td>
              <td class="value">{{ productionData.gananciaMenosImpuestos }}</td>
            </tr>
            <tr>
              <td class="label">Ganancia Neta:</td>
              <td class="value">{{ productionData.gananciaNeta }}</td>
            </tr>
            <tr>
              <td class="label">Coste de Producción:</td>
              <td class="value">{{ productionData.costeProduccion }}</td>
            </tr>
            <tr>
              <td class="label">Coste Total de Producción:</td>
              <td class="value">{{ productionData.costeTotalProduccion }}</td>
            </tr>
            <tr>
              <td class="label">Total Generado por Videos Caídos:</td>
              <td class="value">{{ productionData.totalGeneradoPorCaidos }}</td>
            </tr>
            </tbody>
          </table>
          <p v-else>Cargando datos...</p>
        </div>
        <!-- Contenedor de la gráfica -->
        <div ref="chart" class="chart-container">
          <h3>Comparación de Producción</h3>
          <canvas id="radarChart"></canvas>
          <div class="button-container">
            <button @click="goToStats" class="circle-button">
              <span>Go Stats</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido de Resumen JR's -->
    <div v-if="activeTab === 'jr'" class="ranking-container">
      <h3>Resumen JR's</h3>
      <div
          class="jr-card"
          v-for="(jefe, index) in sortedJefes"
          :key="jefe.id"
      >
        <div class="jr-header">
          <span class="jr-position">#{{ index + 1 }}</span>
          <span class="jr-name">{{ jefe.nombre }}</span>
        </div>
        <div class="jr-stats">
          <div class="jr-stat-item">
            <span class="jr-stat-label">Producción Total</span>
            <span class="jr-stat-value">{{ jefe.produccionTotal }}</span>
          </div>
          <div class="jr-stat-item">
            <span class="jr-stat-label">Ganancias Totales</span>
            <span class="jr-stat-value">{{ jefe.gananciasTotales }}</span>
          </div>
          <div class="jr-stat-item">
            <span class="jr-stat-label">Ganancias Netas</span>
            <span class="jr-stat-value">{{ jefe.gananciasNetas }}</span>
          </div>
          <div class="jr-stat-item">
            <span class="jr-stat-label">Número de Caídos</span>
            <span class="jr-stat-value">{{ jefe.caidos }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido de Redactores (para Jefe de Redacción) -->
    <div v-if="activeTab === 'redactores'" class="ranking-container">
      <h3>Redactores</h3>
      <div
          class="redactor-card"
          v-for="(redactor, index) in redactores"
          :key="redactor.codigo"
      >
        <div class="redactor-header">
          <span class="redactor-position">#{{ index + 1 }}</span>
          <span class="redactor-name">{{ redactor.nombre }}</span>
        </div>
        <div class="redactor-stats">
          <div class="redactor-stat-item">
            <span class="redactor-stat-label">Videos Totales:</span>
            <span class="redactor-stat-value">{{ redactor.videosTotales }}</span>
          </div>
          <div class="redactor-stat-item">
            <span class="redactor-stat-label">Videos Caídos:</span>
            <span class="redactor-stat-value">{{ redactor.videosCaidos }}</span>
          </div>
          <div class="redactor-stat-item">
            <span class="redactor-stat-label">Comisión:</span>
            <span class="redactor-stat-value">${{ redactor.comisionDolares }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido de Mejores Videos (para Empleados) -->
    <div v-if="activeTab === 'topVideos'" class="video-ranking-container">
      <h3>Mis Mejores Videos</h3>
      <div
          class="video-card"
          v-for="(video, index) in topVideos"
          :key="video.id"
      >
        <img :src="video.thumbnail" alt="Thumbnail" class="video-thumbnail" />
        <div class="video-info">
          <h4 class="video-title">{{ video.title }}</h4>
          <p class="video-revenue">
            Ganancias Estimadas: ${{ video.estimatedRevenue.toFixed(2) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "VideoPerformance",
  data() {
    return {
      activeTab: "produccion", // Controla la pestaña activa
      productionData: null, // Datos de producción general o personal
      productionDataLastMonth: null, // Datos del mes pasado (solo para directivo)
      jrData: null, // Datos de JR's
      topVideos: [], // Mejores videos para empleados
      redactores: [], // Datos para jefe de redacción
      chartInstance: null,
      userId: null, // ID del usuario logueado
      userRole: null, // Rol del usuario logueado
    };
  },
  mounted() {
    this.initializeUser(); // Inicializa el usuario y carga su ID y rol
  },
  methods: {
    async initializeUser() {
      try {
        // Obtén el ID del usuario desde localStorage o Vuex
        this.userId = localStorage.getItem("userId") || null;

        if (!this.userId) {
          console.error("No se encontró el ID del usuario. Verifica la autenticación.");
          return;
        }

        // Obtén los datos del usuario por ID
        const response = await axios.get(`http://localhost:3000/users/${this.userId}`);
        this.userRole = response.data.role;

        // Cargar datos según el rol
        if (this.isDirectivo) {
          this.fetchProductionData(); // Producción general para directivo
        } else {
          this.fetchPersonalProduction(); // Producción personal para otros roles
        }

        // Cargar datos adicionales si aplica
        this.fetchJRData();
        this.fetchTopVideos(); // Mejores videos para empleados
      } catch (error) {
        console.error("Error al inicializar el usuario:", error.message);
      }
    },
    async fetchProductionData() {
      try {
        const response = await axios.get("http://localhost:3000/resumenProduccion");
        const lastMonthResponse = await axios.get(
            "http://localhost:3000/resumenProduccionMesPasado"
        );
        this.productionData = response.data;
        this.productionDataLastMonth = lastMonthResponse.data;

        if (this.productionData && this.productionDataLastMonth) {
          this.renderChart();
        }
      } catch (error) {
        console.error("Error al obtener datos de producción:", error.message);
      }
    },
    async fetchPersonalProduction() {
      try {
        const response = await axios.get(
            `http://localhost:3000/produccionPersonal/${this.userId}`
        );
        this.productionData = response.data; // Usamos productionData para reutilizar en la vista
      } catch (error) {
        console.error("Error al obtener datos de producción personal:", error.message);
      }
    },
    async fetchJRData() {
      if (this.isDirectivo || this.isJefePrensa) {
        try {
          const response = await axios.get("http://localhost:3000/rankingJRs");
          this.jrData = response.data;
        } catch (error) {
          console.error("Error al obtener datos de JR's:", error.message);
        }
      }
    },
    async fetchTopVideos() {
      if (this.isEmpleado) {
        try {
          const response = await axios.get(`http://localhost:3000/videos/${this.userId}`);
          this.topVideos = response.data
              .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
              .slice(0, 5); // Tomar los 5 mejores videos
        } catch (error) {
          console.error("Error al obtener los mejores videos:", error.message);
        }
      }
    },
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const normalizedData = this.normalizeData();

      this.$nextTick(() => {
        const ctx = document.getElementById("radarChart").getContext("2d");
        this.chartInstance = new Chart(ctx, {
          type: "radar",
          data: {
            labels: [
              "Total Videos",
              "Videos Caídos",
              "Ganancia Total",
              "Ganancia Neta",
              "Coste Producción",
            ],
            datasets: [
              {
                label: "Este Mes",
                data: [
                  normalizedData.totalVideos.current,
                  normalizedData.videosCaidos.current,
                  normalizedData.gananciaTotal.current,
                  normalizedData.gananciaNeta.current,
                  normalizedData.costeTotalProduccion.current,
                ],
                backgroundColor: "rgba(54, 162, 235, 0.5)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
              },
              {
                label: "Mes Pasado",
                data: [
                  normalizedData.totalVideos.lastMonth,
                  normalizedData.videosCaidos.lastMonth,
                  normalizedData.gananciaTotal.lastMonth,
                  normalizedData.gananciaNeta.lastMonth,
                  normalizedData.costeTotalProduccion.lastMonth,
                ],
                backgroundColor: "rgba(255, 99, 132, 0.5)",
                borderColor: "rgba(255, 99, 132, 1)",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
              },
            },
            scales: {
              r: {
                min: 1,
                max: 10,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          },
        });
      });
    },
    normalizeData() {
      const normalize = (value, min, max) => 1 + 9 * ((value - min) / (max - min));

      return {
        totalVideos: {
          current: normalize(this.productionData.totalVideos, 0, 1400),
          lastMonth: this.isDirectivo
              ? normalize(this.productionDataLastMonth.totalVideos, 0, 1400)
              : null,
        },
        videosCaidos: {
          current: normalize(this.productionData.videosCaidos, 0, 400),
          lastMonth: this.isDirectivo
              ? normalize(this.productionDataLastMonth.videosCaidos, 0, 400)
              : null,
        },
        gananciaTotal: {
          current: normalize(this.productionData.gananciaTotal, 0, 45000),
          lastMonth: this.isDirectivo
              ? normalize(this.productionDataLastMonth.gananciaTotal, 0, 45000)
              : null,
        },
        gananciaNeta: {
          current: normalize(this.productionData.gananciaNeta, 0, 40000),
          lastMonth: this.isDirectivo
              ? normalize(this.productionDataLastMonth.gananciaNeta, 0, 40000)
              : null,
        },
        costeTotalProduccion: {
          current: normalize(this.productionData.costeTotalProduccion, 0, 30000),
          lastMonth: this.isDirectivo
              ? normalize(
                  this.productionDataLastMonth.costeTotalProduccion,
                  0,
                  30000
              )
              : null,
        },
      };
    },
  },
  computed: {
    isDirectivo() {
      return this.userRole === "DIRECTIVO";
    },
    isJefePrensa() {
      return this.userRole === "JEFE_PRENSA";
    },
    isJefeRedaccion() {
      return this.userRole === "JEFE_REDACCION";
    },
    isEmpleado() {
      return ["REDACTOR", "LOCUTOR", "EDITOR", "PANELISTA"].includes(this.userRole);
    },
    sortedJefes() {
      return this.jrData
          ? [...this.jrData].sort((a, b) => b.gananciaPromedio - a.gananciaPromedio)
          : [];
    },
  },
};
</script>

<style scoped>

/* Mantiene todos los estilos originales */

.horizontal-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-top: 10px;
}

.video-performance {
  background-color: #ffffff;
  color: #333;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  margin: 5px auto;
}

h3 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
  border-bottom: 2px solid #ddd;
  padding-bottom: 5px;
}

.production-table {
  flex: 1;
  min-width: 40%;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 15px;
}

.production-table td {
  padding: 10px;
  border-bottom: 1px solid #dfdede;
}

.production-table tr:last-child td {
  border-bottom: none;
}

.label {
  font-weight: bold;
  color: #555;
}

.value {
  text-align: right;
  color: #333;
}

.production-table td:first-child {
  width: 60%;
}

.production-table td:last-child {
  width: 40%;
}

.chart-container {
  margin-top: 10px;
  height: 300px;
  position: relative; /* Necesario para la posición absoluta de la card */
  text-align: center;
  padding-right: max(19px);
}

.max-values-list h4 {
  margin-bottom: 8px;
  font-size: 12px; /* Texto más pequeño */
  font-weight: bold;
  color: #333;
  text-align: center;
}

.max-values-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.max-values-list li {
  margin-bottom: 6px; /* Espaciado más compacto */
  font-size: 10px; /* Texto más pequeño */
  color: #555;
}

.max-values-list li strong {
  color: #333;
}

.circle-button {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 60px;
  border: 3px solid #8a8a8a; /* Borde circular */
  border-radius: 50%; /* Hace el botón circular */
  background-color: transparent; /* Fondo transparente */
  color: #333; /* Color del texto y borde */
  font-size: 10px; /* Tamaño del texto */
  font-weight: bold; /* Negrita */
  cursor: pointer; /* Manito al pasar */
  transition: transform 0.3s, background-color 0.3s;
  text-align: center;
}

.circle-button:hover {
  background-color: #f0f0f0; /* Fondo claro al pasar */
  transform: scale(1.1); /* Animación al hacer hover */
}

.circle-button span {
  transform: rotate(0); /* Texto alineado horizontalmente */
  text-align: center;
}

.jr-quota {
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.quota-label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.quota-percentage {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-top: 5px;
}

.quota-bar-container {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  margin-top: 5px;
  overflow: hidden;
}

.quota-bar {
  height: 100%;
  transition: width 0.3s ease;
}


/* NUEVO: Estilos para pestañas */

.tab-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
  gap: 15px;
}

.tab-container button {
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid transparent;
  background-color: transparent;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-container button:hover {
  color: #007bff;
}

.tab-container button.active-tab {
  border-bottom: 2px solid #007bff; /* Subraya solo la pestaña activa */
  color: #007bff;
}

/* NUEVO: Estilos para el ranking de jefes */

.ranking-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* Tarjeta para cada JR */
.jr-card {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.jr-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

/* Encabezado con posición y nombre */
.jr-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
}

.jr-position {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}

.jr-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-left: 10px;
}

/* Contenedor de estadísticas */
.jr-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 10px;
  column-gap: 15px;
  width: 100%;
}

.jr-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.jr-stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.jr-stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.jr-gain {
  color: #333;
  padding-top: 10px;
  font-size: 17px;
  font-weight: bold;
}

/* Media Queries */

@media (max-width: 768px) {

  .horizontal-container {
    flex-direction: column;
  }

  .chart-container {
    width: 100%;
    height: 350px;
  }

  .tab-container button {
    font-size: 14px;
    padding: 8px 16px;
  }

  .ranking-table th,
  .ranking-table td {
    padding: 10px;
    font-size: 14px;
  }

  .ranking-container {
    padding: 15px;
  }

  .ranking-container h4 {
    font-size: 18px;
  }

  .jr-card {
    padding: 15px;
  }

  .jr-position {
    font-size: 16px;
  }

  .jr-name {
    font-size: 16px;
  }

  .jr-stat-item {
    font-size: 14px;
  }

}

</style>



