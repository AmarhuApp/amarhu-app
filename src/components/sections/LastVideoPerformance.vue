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
    </div>

    <!-- Contenido de Resumen de Producción -->
    <div v-if="activeTab === 'produccion'">
      <h3>Resumen de Producción</h3>
      <p v-if="isEmpleado && useLastMonth" class="info-aviso">
        Mostrando datos del mes anterior (hasta el 4 de este mes)
      </p>
      <div :class="['horizontal-container', { 'full-width-card': isEmpleado }]">

        <!-- 👤 Empleados: datos personales -->
        <div v-if="isEmpleado">
          <table v-if="!isLoadingProduction" class="production-table">
            <tbody>
            <tr>
              <td class="label">Total de Videos:</td>
              <td class="value">
                {{ useLastMonth ? productionDataLastMonth.videosTotales : productionData.videosTotales }}
              </td>
            </tr>
            <tr>
              <td class="label">Videos Caídos:</td>
              <td class="value">
                {{ useLastMonth ? productionDataLastMonth.videosCaidos : productionData.videosCaidos }}
              </td>
            </tr>
            <tr>
              <td class="label">Videos Productivos:</td>
              <td class="value">
                {{
                  (useLastMonth
                      ? productionDataLastMonth.videosTotales - productionDataLastMonth.videosCaidos
                      : productionData.videosTotales - productionData.videosCaidos)
                }}
              </td>
            </tr>
            <tr>
              <td class="label">Comisión:</td>
              <td class="value">
                ${{ (useLastMonth ? productionDataLastMonth.comisionDolares : productionData.comisionDolares)?.toFixed(2) || '0.00' }} USD
              </td>
            </tr>
            </tbody>
          </table>
          <p v-else>Cargando datos personales...</p>
        </div>


        <!-- 🧑‍💼 Directivos: datos globales -->
        <div v-else>
          <table v-if="productionData.totalVideos != null" class="production-table">
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
          <p v-else>Cargando datos globales...</p>

          <!-- Comparativa visual -->
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
  </div>
</template>




<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { useUserStore } from "@/store/user";
import { waitForAuth } from "@/utils/authReady";

Chart.register(...registerables);

export default {
  name: "VideoPerformance",
  data() {
    return {
      activeTab: "produccion",
      productionData: {
        user: null,
        totalVideos: 0,
        videosCaidos: 0,
        gananciaTotal: 0,
        gananciaMenosImpuestos: 0,
        gananciaNeta: 0,
        costeProduccion: 0,
        costeTotalProduccion: 0,
        totalGeneradoPorCaidos: 0,
      },
      productionDataLastMonth: {
        user: null,
        totalVideos: 0,
        videosCaidos: 0,
        gananciaTotal: 0,
        gananciaMenosImpuestos: 0,
        gananciaNeta: 0,
        costeProduccion: 0,
        costeTotalProduccion: 0,
        totalGeneradoPorCaidos: 0,
      },
      jrData: null,
      topVideos: [],
      redactores: [],
      chartInstance: null,
      baseURL: "https://api.pa-reporte.com",
      isLoadingProduction: true, // ✅ nueva bandera
    };
  },
  async mounted() {
    await waitForAuth();

    const unwatch = this.$watch(
        () => this.userStore.user.id,
        async (id) => {
          if (id) {
            console.log("✅ Usuario con ID listo:", id);
            await this.loadDataBasedOnRole();
            unwatch(); // detiene el watch después de obtener el ID
          }
        },
        { immediate: true }
    );
  },
  methods: {
    async loadDataBasedOnRole() {
      console.log("🔍 Verificando rol: Directivo =", this.isDirectivo);
      try {
        const today = new Date();
        const day = today.getDate();

        if (this.isDirectivo) {
          await this.fetchProductionData();
        } else {
          if (day <= 4) {
            await this.fetchPersonalProductionLastMonth();
          } else {
            await this.fetchPersonalProduction();
          }
        }

        await this.fetchJRData();
        await this.fetchTopVideos();
      } catch (error) {
        console.error("❌ Error al cargar datos según rol:", error);
      }
    },
    async fetchPersonalProduction() {
      this.isLoadingProduction = true;
      try {
        const response = await axios.get(`${this.baseURL}/api/personal-production/${this.userStore.user.id}`);
        this.productionData = response.data;
      } catch (error) {
        console.error("Error al obtener datos de producción personal:", error.message);
      } finally {
        this.isLoadingProduction = false;
      }
    },
    async fetchPersonalProductionLastMonth() {
      try {
        const response = await axios.get(`${this.baseURL}/api/personal-production/last-month/${this.userStore.user.id}`);
        this.productionDataLastMonth = response.data;
      } catch (error) {
        console.error("Error al obtener datos del mes pasado:", error.message);
      } finally {
        this.isLoadingProduction = false;
      }
    },
    async fetchProductionData() {
      try {
        const response = await axios.get(`${this.baseURL}/api/production`);
        Object.assign(this.productionData, response.data);

        const lastMonthResponse = await axios.get(`${this.baseURL}/api/production-last-month`);
        this.productionDataLastMonth = lastMonthResponse.data;

        this.renderChart();
      } catch (error) {
        console.error("❌ Error capturado:", error.message);
      }
    },
    async fetchJRData() {
      if (this.isDirectivo || this.isJefePrensa) {
        try {
          const response = await axios.get(`${this.baseURL}/api/rankingJRs`);
          this.jrData = response.data;
        } catch (error) {
          console.error("Error al obtener datos de JR's:", error.message);
        }
      }
    },
    async fetchTopVideos() {
      if (this.isEmpleado) {
        try {
          const response = await axios.get(
              `${this.baseURL}/api/personal-videos/${this.userStore.user.id}`
          );
          this.topVideos = response.data
              .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
              .slice(0, 5);
        } catch (error) {
          console.error("Error al obtener los mejores videos:", error.message);
        }
      }
    },
    renderChart() {
      if (!this.productionData || !this.productionDataLastMonth) return;
      const normalizedData = this.normalizeData();
      this.$nextTick(() => {
        const canvas = document.getElementById("radarChart");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (this.chartInstance) this.chartInstance.destroy();

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
            plugins: { legend: { position: "top" } },
            scales: { r: { min: 1, max: 10, ticks: { stepSize: 1 } } },
          },
        });
      });
    },
    normalizeData() {
      const normalize = (value, min, max) => 1 + 9 * ((value - min) / (max - min));
      return {
        totalVideos: {
          current: normalize(this.productionData.totalVideos, 0, 1400),
          lastMonth: this.isDirectivo ? normalize(this.productionDataLastMonth.totalVideos, 0, 1400) : null,
        },
        videosCaidos: {
          current: normalize(this.productionData.videosCaidos, 0, 400),
          lastMonth: this.isDirectivo ? normalize(this.productionDataLastMonth.videosCaidos, 0, 400) : null,
        },
        gananciaTotal: {
          current: normalize(this.productionData.gananciaTotal, 0, 45000),
          lastMonth: this.isDirectivo ? normalize(this.productionDataLastMonth.gananciaTotal, 0, 45000) : null,
        },
        gananciaNeta: {
          current: normalize(this.productionData.gananciaNeta, 0, 40000),
          lastMonth: this.isDirectivo ? normalize(this.productionDataLastMonth.gananciaNeta, 0, 40000) : null,
        },
        costeTotalProduccion: {
          current: normalize(this.productionData.costeTotalProduccion, 0, 30000),
          lastMonth: this.isDirectivo ? normalize(this.productionDataLastMonth.costeTotalProduccion, 0, 30000) : null,
        },
      };
    },
  },
  computed: {
    userStore() {
      return useUserStore();
    },
    isDirectivo() {
      return this.userStore.user.role === "DIRECTIVO";
    },
    isJefePrensa() {
      return this.userStore.user.role === "JEFE_PRENSA";
    },
    isJefeRedaccion() {
      return this.userStore.user.role === "JEFE_REDACCION";
    },
    isEmpleado() {
      return ["REDACTOR", "LOCUTOR", "EDITOR", "PANELISTA"].includes(this.userStore.user.role);
    },
    sortedJefes() {
      return this.jrData
          ? [...this.jrData].sort((a, b) => b.gananciaPromedio - a.gananciaPromedio)
          : [];
    },
    useLastMonth() {
      return this.isEmpleado && new Date().getDate() <= 4;
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
  width: 70%;
  padding-right: 500px;
}

.production-table td:last-child {
  width: 30%;
  text-align: right;
}

/* Responsive: reduce separación en pantallas pequeñas */
@media (max-width: 768px) {
  .production-table td:first-child {
    width: 60%;
    padding-right: 10px;
  }

  .production-table td:last-child {
    width: 40%;
  }
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

canvas {
  background-color: rgba(0, 255, 0, 0.1); /* Verde muy tenue */
  width: 100% !important;
  height: 100% !important;
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

.full-width-card {
  justify-content: center;
}

.full-width-card > .production-table {
  min-width: 100%;
  max-width: 100%;
}

.info-aviso {
  color: #777;
  font-style: italic;
  margin-bottom: 10px;
}

</style>
