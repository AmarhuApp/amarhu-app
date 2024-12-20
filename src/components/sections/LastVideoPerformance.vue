<template>
  <div class="video-performance">
    <!-- Navegación de pestañas -->
    <div class="tab-container">
      <button
          :class="{'active-tab': activeTab === 'produccion'}"
          @click="activeTab = 'produccion'">
        Resumen de Producción
      </button>
      <button
          :class="{'active-tab': activeTab === 'jr'}"
          @click="activeTab = 'jr'">
        Resumen JR's
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
              <td class="label">Directivo:</td>
              <td class="value">{{ productionData.directivo }}</td>
            </tr>
            <tr>
              <td class="label">Código de directivo:</td>
              <td class="value">{{ productionData.codigoDirectivo }}</td>
            </tr>
            <tr>
              <td class="label">Total de Videos:</td>
              <td class="value">{{ productionData.totalVideos }}</td>
            </tr>
            <tr>
              <td class="label">Filtro de caídos:</td>
              <td class="value">{{ productionData.filtroCaidos }}</td>
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
      <div
          class="jr-card"
          v-for="(jefe, index) in sortedJefes"
          :key="jefe.id"
      >
        <!-- Encabezado -->
        <div class="jr-header">
          <span class="jr-position">#{{ index + 1 }}</span>
          <span class="jr-name">{{ jefe.nombre }}</span>
        </div>

        <!-- Estadísticas -->
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
            <span class="jr-stat-value">{{ jefe.numeroCaidos }}</span>
          </div>
        </div>

        <!-- Barra de progreso -->
        <div class="jr-quota">
          <span class="quota-label">Cuota: {{ jefe.quota }}</span>
          <span class="quota-percentage">{{ jefe.quotaProgress }}%</span>
          <div class="quota-bar-container">
            <div
                class="quota-bar"
                :style="{
            width: jefe.quotaProgress + '%',
            backgroundColor: jefe.quotaProgress >= 100 ? 'green' : 'blue'
          }"
            ></div>
          </div>
        </div>

        <!-- Ganancia promedio destacada -->
        <div class="jr-gain">
          Ganancia Promedio: {{ jefe.gananciaPromedio.toFixed(2) }}
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
      productionData: null,
      productionDataLastMonth: null,
      maxValues: {}, // Almacena los valores máximos que representan el 10 en cada categoría
      jrData: null, // Datos para el resumen JR's
      chartInstance: null, // Referencia a la instancia de la gráfica
    };
  },
  mounted() {
    this.fetchProductionData();
    this.setMaxValues();
    this.fetchJRData(); // Cargar datos de JR's
  },
  methods: {
    goToStats() {
      this.$router.push("/statistics");
    },
    async fetchProductionData() {
      try {
        // Fetch current month's production data
        const response = await axios.get("http://localhost:3000/resumenProduccion");
        console.log("Datos del mes actual:", response.data);
        this.productionData = response.data;

        // Fetch last month's production data
        const responseLastMonth = await axios.get("http://localhost:3000/resumenProduccionMesPasado");
        console.log("Datos del mes pasado:", responseLastMonth.data);
        this.productionDataLastMonth = responseLastMonth.data;

        // Render chart only if both data sets are available
        if (this.productionData && this.productionDataLastMonth) {
          this.renderChart();
        }
      } catch (error) {
        console.error("Error al obtener los datos de la API:", error.message);
      }
    },
    async fetchJRData() {
      try {
        // Fetch data for Resumen JR's
        const response = await axios.get("http://localhost:3000/rankingJRs");
        console.log("Datos de Resumen JR's:", response.data);

        // Procesar datos de JR
        this.jrData = response.data.map((jr) => {
          const quota = this.getQuota(jr.id); // Asigna cuota específica para cada JR
          const quotaProgress = Math.min(
              Math.round((jr.produccionTotal / quota) * 100),
              100
          ); // Calcula el progreso, limitándolo a 100%

          return {
            ...jr,
            quota,
            quotaProgress, // Porcentaje respecto a la cuota
            gananciaPromedio: jr.produccionTotal
                ? jr.gananciasNetas / jr.produccionTotal
                : 0, // Evita división por 0
          };
        });
      } catch (error) {
        console.error("Error al obtener los datos de JR's:", error.message);
      }
    },
    getQuota(jrId) {
      // Define cuotas específicas para cada JR
      const quotas = {
        1: 170,
        2: 400,
        3: 400,
        4: 300,
      };
      return quotas[jrId] || 200; // Valor por defecto si no está definido
    },
    normalizeData() {
      // Definir rangos específicos para cada categoría
      const categoryRanges = {
        totalVideos: { min: 0, max: 1400 },
        filtroCaidos: { min: 0, max: 400 },
        gananciaTotal: { min: 0, max: 45000 },
        gananciaNeta: { min: 0, max: 40000 },
        costeTotalProduccion: { min: 0, max: 30000 },
      };

      // Normalizar cada categoría a la escala 1-10
      const normalizeCategory = (category) => {
        const { min, max } = categoryRanges[category];
        return {
          current: 1 + 9 * ((this.productionData[category] - min) / (max - min)), // Escala 1-10
          lastMonth: 1 + 9 * ((this.productionDataLastMonth[category] - min) / (max - min)),
        };
      };

      return {
        totalVideos: normalizeCategory("totalVideos"),
        filtroCaidos: normalizeCategory("filtroCaidos"),
        gananciaTotal: normalizeCategory("gananciaTotal"),
        gananciaNeta: normalizeCategory("gananciaNeta"),
        costeTotalProduccion: normalizeCategory("costeTotalProduccion"),
      };
    },
    setMaxValues() {
      // Valores máximos correspondientes al 10 en cada categoría
      this.maxValues = {
        "Total Videos": 1400,
        "Filtro Caídos": 400,
        "Ganancia Total": 45000,
        "Ganancia Neta": 40000,
        "Coste Total Producción": 30000,
      };
    },
    renderChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy(); // Destruye la gráfica existente antes de crear una nueva
      }

      const normalizedData = this.normalizeData();

      this.$nextTick(() => {
        const ctx = document.getElementById("radarChart").getContext("2d");
        this.chartInstance = new Chart(ctx, {
          type: "radar",
          data: {
            labels: [
              "Total Videos",
              "Filtro Caídos",
              "Ganancia Total",
              "Ganancia Neta",
              "Coste Producción",
            ],
            datasets: [
              {
                label: "Este Mes",
                data: [
                  normalizedData.totalVideos.current,
                  normalizedData.filtroCaidos.current,
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
                  normalizedData.filtroCaidos.lastMonth,
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
                min: 1, // Escala mínima
                max: 10, // Escala máxima
                ticks: {
                  stepSize: 1, // Intervalos claros
                },
              },
            },
          },
        });
      });
    },
  },
  watch: {
    activeTab(newValue) {
      if (newValue === "produccion" && this.productionData && this.productionDataLastMonth) {
        this.renderChart(); // Renderiza la gráfica al volver a la pestaña "produccion"
      }
    },
  },
  computed: {
    sortedJefes() {
      // Ordena los jefes por ganancia promedio en orden descendente
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



