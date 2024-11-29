<template>
  <div class="video-performance">
    <h3>Resumen de Producción</h3>

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

    <!-- Botón para desplazamiento -->
    <div class="button-container">
      <button @click="scrollToChart">Ver Gráfica Comparativa</button>
    </div>

    <!-- Contenedor para la gráfica y la lista -->
    <div class="content">
      <!-- Contenedor de la gráfica -->
      <div ref="chart" class="chart-container">
        <h3>Comparación de Producción</h3>
        <canvas id="radarChart"></canvas>
      </div>

      <!-- Lista de valores máximos -->
      <div class="max-values-list">
        <h4>Valores Máximos (10):</h4>
        <ul>
          <li v-for="(value, category) in maxValues" :key="category">
            <strong>{{ category }}:</strong> {{ value }}
          </li>
        </ul>
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
            "Coste Total Producción",
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
.video-performance {
  background-color: #fff;
  color: #333;
  padding: 20px;
  max-width: 800px;
  margin: auto;
  position: relative;
}

h3 {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: center;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.production-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  margin-top: 10px;
}

.production-table td {
  padding: 8px 12px; /* Reducido para un diseño compacto */
  border-bottom: 1px solid #eaeaea;
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

.button-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

button {
  background-color: #4caf50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

.chart-container {
  margin-top: 30px;
  height: 400px;
  position: relative; /* Necesario para la posición absoluta de la card */
  text-align: center;
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

@media (max-width: 768px) {
  .max-values-list {
    position: static; /* Cambia a posición normal en pantallas pequeñas */
    width: 100%;
    margin: 20px 0;
    font-size: 14px; /* Ajusta el texto en pantallas pequeñas */
  }

  .chart-container {
    height: 350px;
  }
}
</style>


