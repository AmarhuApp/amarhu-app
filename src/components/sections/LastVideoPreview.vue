<template>
  <div class="last-video-preview">
    <!-- Card principal -->
    <div class="video-card">
      <h3>Resumen de Producción</h3>
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-label">Total Videos:</span>
          <span class="stat-value">{{ productionData.totalVideos }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Ganancia Neta:</span>
          <span class="stat-value">${{ productionData.gananciaNeta.toFixed(2) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Videos Caídos:</span>
          <span class="stat-value">{{ productionData.videosCaidos }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Coste Producción:</span>
          <span class="stat-value">${{ productionData.costeTotalProduccion.toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- JR destacado -->
    <div class="highlighted-jr">
      <h3>JR Más Destacado</h3>
      <div class="jr-info">
        <span class="jr-name">{{ topJR.nombre }}</span>
        <span class="jr-quota">
          Cuota: {{ topJR.quota }} | {{ topJR.quotaProgress }}%
        </span>
        <div class="quota-bar-container">
          <div
              class="quota-bar"
              :style="{
              width: topJR.quotaProgress + '%',
              backgroundColor: topJR.quotaProgress >= 100 ? 'green' : 'blue',
            }"
          ></div>
        </div>
        <span class="jr-net-earnings">
          Ganancia Neta: ${{ topJR.gananciasNetas.toFixed(2) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LastVideoPreview",
  data() {
    return {
      productionData: {
        totalVideos: 0,
        gananciaNeta: 0,
        videosCaidos: 0,
        costeTotalProduccion: 0,
      },
      topJR: {
        nombre: "",
        quota: 0,
        quotaProgress: 0,
        gananciasNetas: 0,
      },
    };
  },
  async created() {
    await this.fetchProductionData();
    await this.fetchTopJRData();
  },
  methods: {
    async fetchProductionData() {
      try {
        const response = await axios.get("http://localhost:3000/resumenProduccion");
        this.productionData = response.data;
      } catch (error) {
        console.error("Error al obtener los datos de producción:", error);
      }
    },
    async fetchTopJRData() {
      try {
        const response = await axios.get("http://localhost:3000/rankingJRs");
        const ranking = response.data;

        // Obtener el JR con la mejor ganancia promedio
        const topJR = ranking[0];
        const quota = this.getQuota(topJR.id);
        const quotaProgress = Math.min(
            Math.round((topJR.produccionTotal / quota) * 100),
            100
        );

        this.topJR = {
          ...topJR,
          quota,
          quotaProgress,
        };
      } catch (error) {
        console.error("Error al obtener el JR más destacado:", error);
      }
    },
    getQuota(jrId) {
      const quotas = {
        1: 170,
        2: 400,
        3: 400,
        4: 300,
      };
      return quotas[jrId] || 200; // Valor por defecto
    },
  },
};
</script>

<style scoped>
.last-video-preview {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 350px; /* Ancho máximo ajustado */
  margin: 0 auto; /* Centrado horizontal */
}

.video-card {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.video-card h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.stats-overview {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 14px;
  color: #555;
}

.stat-item .stat-label {
  font-weight: bold;
}

.highlighted-jr {
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.highlighted-jr h3 {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.jr-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.jr-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.jr-quota {
  font-size: 14px;
  color: #666;
}

.quota-bar-container {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 5px;
}

.quota-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.jr-net-earnings {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}
</style>
