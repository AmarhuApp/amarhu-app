<template>
  <div class="video-performance">
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
</template>



<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

export default {
  name: "VideoPerformance",
  data() {
    return {
      productionData: null,
      productionDataLastMonth: null,
      maxValues: {}, // Almacena los valores máximos que representan el 10 en cada categoría
    };
  },
  mounted() {
    this.fetchProductionData();
    this.setMaxValues();
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
        console.error("Detalles del error:", error.response?.data || error);
      }
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

    scrollToChart() {
      this.$refs.chart.scrollIntoView({ behavior: "smooth" });
    },

    renderChart() {
      const normalizedData = this.normalizeData();

      const ctx = document.getElementById("radarChart").getContext("2d");
      new Chart(ctx, {
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
    },
  },
};
</script>


<style scoped>

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

.max-values-list {
  position: absolute; /* Posiciona la card dentro del contenedor de la gráfica */
  top: 640px; /* Ajusta la altura respecto a la gráfica */
  right: 10px; /* Posiciona hacia la derecha dentro del contenedor */
  width: 155px; /* Ancho reducido para un diseño compacto */
  background-color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 6px;
  padding: 10px; /* Reducido para menos espacio interno */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1); /* Sombra más sutil */
  text-align: left;
  font-size: 12px; /* Texto más pequeño */
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



@media (max-width: 768px) {
  .max-values-list {
    position: static; /* Cambia a posición normal en pantallas pequeñas */
    width: 100%;
    margin: 20px 0;
    font-size: 14px; /* Ajusta el texto en pantallas pequeñas */
  }

  .horizontal-container {
    flex-direction: column;
  }

  .chart-container {
    width: 100%;
    height: 350px;
  }
}
</style>


