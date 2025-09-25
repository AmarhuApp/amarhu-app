<template>
  <div class="statistics">
    <div class="content-wrapper">
      <div class="main-content">
        <h1>Estadísticas</h1>

        <!-- Bloque 1: Resumen semanal/mensual para empleados Y DIRECTIVOS -->
        <div v-if="isEmpleado || isDirectivo">
          <div class="tab-container">
            <button :class="{ 'active-tab': activeTab === 'semana' }" @click="activeTab = 'semana'">
              Resumen semanal
            </button>
            <button :class="{ 'active-tab': activeTab === 'mes' }" @click="activeTab = 'mes'">
              Resumen mensual
            </button>
            <button
                v-if="showPreviousMonthTab"
                :class="{ 'active-tab': activeTab === 'mesAnterior' }"
                @click="activeTab = 'mesAnterior'">
              Resumen mes pasado
            </button>
          </div>

          <!-- Gráficas -->
          <div class="chart" v-if="activeTab === 'semana'">
            <canvas :key="'weekly-' + activeTab" ref="weeklyChart"></canvas>
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
            <canvas :key="'monthly-' + activeTab" ref="monthlyChart"></canvas>
          </div>
          <div class="monthly-summary" v-if="activeTab === 'mes' && monthSummary">
            <p>
              Total de videos producidos: {{ monthSummary.total }} |
              Caídos: {{ monthSummary.caidos }} |
              Comisión acumulada: {{ monthSummary.comision }} dólares USA
            </p>
            <p>{{ capitalize(monthSummary.mes) }}</p>
          </div>

          <div class="chart" v-if="activeTab === 'mesAnterior'">
            <canvas :key="'previousMonth-' + activeTab" ref="previousMonthChart"></canvas>
          </div>
          <div class="monthly-summary" v-if="activeTab === 'mesAnterior' && monthSummaryLastMonth">
            <p>
              Total de videos producidos: {{ monthSummaryLastMonth.total }} |
              Caídos: {{ monthSummaryLastMonth.caidos }} |
              Comisión acumulada: {{ monthSummaryLastMonth.comision }} dólares USA
            </p>
            <p>{{ capitalize(monthSummaryLastMonth.mes) }}</p>
          </div>
        </div>


        <!-- Bloque 2: Charts + Top + botón (para NO empleados O JEFE_REDACCION) -->
        <div v-if="!isEmpleado || isJefeRedaccion">

          <!-- SOLO para DIRECTIVO -->
          <div v-if="isDirectivo">
            <div style="margin: 20px 0; text-align: center;">
              <button class="filter-button" @click="fetchJefesRedaccion">
                Ver Estadísticas de Jefes de Redacción
              </button>
            </div>

            <!-- Pestañas de Jefes de Redacción -->
            <div v-if="jefesRedaccionDetalles.length > 0" class="tab-container">
              <button
                  v-for="jefe in jefesRedaccionDetalles"
                  :key="jefe.codigo"
                  :class="{ 'active-tab': activeJefeTab === jefe.codigo }"
                  @click="activeJefeTab = jefe.codigo"
              >
                {{ jefe.nombre }}
              </button>
            </div>

            <!-- Gráfica mensual del jefe activo -->
            <div v-if="jefeActivoDetalle" class="chart">
              <canvas :key="'jefe-' + activeJefeTab" ref="jefeMonthlyChart"></canvas>
            </div>
          </div>

          <!-- SOLO para JEFE_REDACCION -->
          <div v-if="isJefeRedaccion">
            <!-- Botón para ver estadísticas individuales -->
            <div style="margin: 20px 0; text-align: center;">
              <button class="filter-button" @click="fetchRedactoresGrupo">
                Ver Estadísticas de mis Redactores
              </button>
            </div>

            <!-- Pestañas solo si hay redactores -->
            <div v-if="redactoresDetalles.length > 0" class="tab-container">
              <button
                  v-for="redactor in redactoresDetalles"
                  :key="redactor.codigo"
                  :class="{ 'active-tab': activeRedactorTab === redactor.codigo }"
                  @click="activeRedactorTab = redactor.codigo"
              >
                {{ redactor.nombre }}
              </button>
            </div>

            <!-- Gráfica mensual del redactor activo -->
            <div v-if="redactorActivoDetalle" class="chart">
              <canvas :key="'redactor-' + activeRedactorTab" ref="redactorMonthlyChart"></canvas>
            </div>
          </div>
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
      jefesRedaccionDetalles: [],
      activeJefeTab: null,
      jefeMonthlyChartInstance: null,
      redactoresDetalles: [],
      activeRedactorTab: null,
      redactorMonthlyChartInstance: null,
      monthSummary: null,
      monthSummaryLastMonth: null,
      weekSummary: null,
      weeklyChartInstance: null,
      monthlyChartInstance: null,
      previousMonthChartInstance: null,
      resumenProduccion: null,
      resumenProduccionMesPasado: null,
      videos: [],
      topProducers: [],
      userStore: useUserStore(),
      activeTab: "semana",
      baseURL: "https://api.pa-reporte.com",
      maxVideosPorDiaPersonalizado: 12,
      mostrarJefes: false,
      tabs: []
    };
  },
  computed: {
    codigoGrupoJefe() {
      if (this.userStore.user.role === "JEFE_REDACCION" && this.userStore.user.codigo) {
        const match = this.userStore.user.codigo.match(/^JR(\d+)/);
        if (match) {
          return `RA${match[1]}`;
        }
      }
      return null;
    },
    isJefeRedaccion() {
      return this.userStore.user.role === "JEFE_REDACCION";
    },
    isDirectivo() {
      return this.userStore.user.role === "DIRECTIVO";
    },
    redactorActivoDetalle() {
      return this.redactoresDetalles.find(r => r.codigo === this.activeRedactorTab) || null;
    },
    jefeActivoDetalle() {
      return this.jefesRedaccionDetalles.find(j => j.codigo === this.activeJefeTab) || null;
    },
    isNewsFeedVisible() {
      const route = useRoute();
      return route.path !== "/reports" && route.path !== "/statistics";
    },
    isEmpleado() {
      return [
        "REDACTOR",
        "LOCUTOR",
        "EDITOR",
        "PANELISTA",
        "JEFE_REDACCION",
        "JEFE_ENTREVISTAS",
        "JEFE_PRENSA"
      ].includes(this.userStore.user.role);
    },
    showPreviousMonthTab() {
      const today = new Date().getDate();
      return this.isDirectivo || today <= 7;
    }
  },
  watch: {
    '$route.path'(newVal) {
      if (newVal === '/statistics') {
        this.$nextTick(() => {
          if (this.activeTab === 'semana') this.renderWeeklyChart();
          if (this.activeTab === 'mes') this.renderMonthlyChart();
          if (this.activeTab === 'mesAnterior') this.renderPreviousMonthChart();
        });
      }
    },
    activeTab(newTab) {
      this.$nextTick(() => {
        if (this.isEmpleado) {
          if (newTab === 'semana' && this.$refs.weeklyChart) this.renderWeeklyChart();
          if (newTab === 'mes' && this.$refs.monthlyChart) this.renderMonthlyChart();
          if (newTab === 'mesAnterior' && this.showPreviousMonthTab && this.$refs.previousMonthChart) this.renderPreviousMonthChart();
        } else if (this.isDirectivo) {
          if ((newTab === 'semana' || newTab === 'mes' || newTab === 'mesAnterior')) {
            this.renderCharts(); // ya válida internamente sus refs
          }
        }
      });
    },
    activeJefeTab(newTab) {
      if (this.jefeActivoDetalle) {
        this.$nextTick(() => {
          this.renderJefeMonthlyChart();
        });
      }
    },
    activeRedactorTab(newTab) {
      if (this.redactorActivoDetalle) {
        this.$nextTick(() => {
          this.renderRedactorMonthlyChart();
        });
      }
    }
  },
  methods: {
    isCaido(video) {
      const comision = typeof video.estimatedRevenue === 'number' ? video.estimatedRevenue : parseFloat(video.estimatedRevenue);
      return comision < 1.66452;
    },
    isCaidoDirectivo(video) {
      const comision = typeof video.estimatedRevenue === 'number' ? video.estimatedRevenue : parseFloat(video.estimatedRevenue);
      return comision < 10;
    },
    async renderJefeMonthlyChart() {
      try {
        if (this.jefeMonthlyChartInstance) {
          this.jefeMonthlyChartInstance.destroy();
          this.jefeMonthlyChartInstance = null;
        }

        await this.$nextTick();

        const today = new Date();
        const monthToUse = today.getMonth();
        const yearToUse = today.getFullYear();
        const daysInMonth = new Date(yearToUse, monthToUse + 1, 0).getDate();
        const monthlyAdjusted = Array(daysInMonth).fill(0);

        const videos = this.jefeActivoDetalle?.videosProcesados || [];

        videos.forEach((v) => {
          const date = new Date(v.date);
          if (date.getMonth() === monthToUse && date.getFullYear() === yearToUse) {
            const day = date.getDate() - 1;
            monthlyAdjusted[day]++;
          }
        });

        const max = Math.max(...monthlyAdjusted);
        if (max > this.maxVideosPorDiaPersonalizado) {
          this.maxVideosPorDiaPersonalizado = max;
        }

        const chartOptions = this.getChartOptions("Videos producidos por día (Jefe de Redacción)", "Videos producidos");

        if (this.$refs.jefeMonthlyChart) {
          this.jefeMonthlyChartInstance = new Chart(this.$refs.jefeMonthlyChart, {
            type: "line",
            data: {
              labels: monthlyAdjusted.map((_, i) => `${(i + 1).toString().padStart(2, "0")}`),
              datasets: [{
                label: "Videos por día",
                data: monthlyAdjusted,
                borderColor: "#6a1b9a",
                backgroundColor: "rgba(106, 27, 154, 0.3)",
                fill: true,
                tension: 0.3
              }]
            },
            options: chartOptions
          });
        }
      } catch (error) {
        console.error("Error en renderJefeMonthlyChart:", error);
      }
    },
    async renderRedactorMonthlyChart() {
      try {
        if (this.redactorMonthlyChartInstance) {
          this.redactorMonthlyChartInstance.destroy();
          this.redactorMonthlyChartInstance = null;
        }

        await this.$nextTick();

        const today = new Date();
        const monthToUse = today.getMonth();
        const yearToUse = today.getFullYear();
        const daysInMonth = new Date(yearToUse, monthToUse + 1, 0).getDate();
        const monthlyAdjusted = Array(daysInMonth).fill(0);

        const videos = this.redactorActivoDetalle?.videosProcesados || [];

        videos.forEach((v) => {
          const date = new Date(v.date);
          if (date.getMonth() === monthToUse && date.getFullYear() === yearToUse) {
            const day = date.getDate() - 1;
            monthlyAdjusted[day]++;
          }
        });

        const max = Math.max(...monthlyAdjusted);
        if (max > this.maxVideosPorDiaPersonalizado) {
          this.maxVideosPorDiaPersonalizado = max;
        }

        const chartOptions = this.getChartOptions("Videos producidos por día (Redactor)", "Videos producidos");

        if (this.$refs.redactorMonthlyChart) {
          this.redactorMonthlyChartInstance = new Chart(this.$refs.redactorMonthlyChart, {
            type: "line",
            data: {
              labels: monthlyAdjusted.map((_, i) => `${(i + 1).toString().padStart(2, "0")}`),
              datasets: [{
                label: "Videos por día",
                data: monthlyAdjusted,
                borderColor: "#ff9900",
                backgroundColor: "rgba(255, 153, 0, 0.3)",
                fill: true,
                tension: 0.3
              }]
            },
            options: chartOptions
          });
        }
      } catch (error) {
        console.error("Error en renderRedactorMonthlyChart:", error);
      }
    },
    async renderPreviousMonthChart() {
      try {
        if (this.previousMonthChartInstance) {
          this.previousMonthChartInstance.destroy();
          this.previousMonthChartInstance = null;
        }

        await this.$nextTick();

        const today = new Date();
        let monthToUse = today.getMonth() - 1;
        let yearToUse = today.getFullYear();
        if (monthToUse < 0) {
          monthToUse = 11;
          yearToUse -= 1;
        }

        const daysInMonth = new Date(yearToUse, monthToUse + 1, 0).getDate();
        const monthlyAdjusted = Array(daysInMonth).fill(0);

        let totalMes = 0;
        let caidosMes = 0;
        let comisionMes = 0;

        const caidoFn = this.isDirectivo ? this.isCaidoDirectivo : this.isCaido;

        this.videos.forEach((v) => {
          const date = new Date(v.date);
          if (date.getMonth() === monthToUse && date.getFullYear() === yearToUse) {
            const day = date.getDate() - 1;
            monthlyAdjusted[day]++;
            totalMes++;
            const comision = typeof v.estimatedRevenue === 'number' ? v.estimatedRevenue : parseFloat(v.estimatedRevenue) || 0;
            if (caidoFn.call(this, v)) caidosMes++;
            else comisionMes += comision;
          }
        });

        const max = Math.max(...monthlyAdjusted);
        if (max > this.maxVideosPorDiaPersonalizado) {
          this.maxVideosPorDiaPersonalizado = max;
        }

        const chartOptions = this.getChartOptions("Videos producidos por día del mes pasado", "Videos producidos");

        if (this.$refs.previousMonthChart) {
          this.previousMonthChartInstance = new Chart(this.$refs.previousMonthChart, {
            type: "line",
            data: {
              labels: monthlyAdjusted.map((_, i) => `${(i + 1).toString().padStart(2, "0")}`),
              datasets: [{
                label: "Videos por día",
                data: monthlyAdjusted,
                borderColor: "#e76f51",
                backgroundColor: "rgba(231, 111, 81, 0.3)",
                fill: true,
                tension: 0.3
              }]
            },
            options: chartOptions
          });
        }

        this.monthSummaryLastMonth = {
          total: totalMes,
          caidos: caidosMes,
          comision: comisionMes.toFixed(2),
          mes: new Date(yearToUse, monthToUse).toLocaleDateString("es-PE", { month: "long", year: "numeric" })
        };
      } catch (error) {
        console.error("Error en renderPreviousMonthChart:", error);
      }
    },
    async fetchJefesRedaccion() {
      try {
        const response = await axios.get(`${this.baseURL}/api/user`);

        const jefesRedaccion = response.data.filter(user =>
            user.role === "JEFE_REDACCION" && user.codigo
        );

        console.log("✅ Jefes de Redacción encontrados:", jefesRedaccion);

        // Evitar recargar si ya están los mismos jefes
        const mismos = jefesRedaccion.length === this.jefesRedaccionDetalles.length &&
            jefesRedaccion.every(jefe => this.jefesRedaccionDetalles.some(d => d.codigo === jefe.codigo));

        if (mismos) {
          // Si ya están cargados, ocultamos (toggle)
          this.jefesRedaccionDetalles = [];
          this.activeJefeTab = null;
          return;
        }

        // Si son diferentes o no están cargados aún
        this.jefesRedaccionDetalles = [];

        for (const jefe of jefesRedaccion) {
          try {
            const resVideos = await axios.get(`${this.baseURL}/api/personal-videos/${jefe.id}`);

            const videosProcesados = resVideos.data.map((item) => {
              const date = new Date(item.date);
              const fechaPublicacion = date.toLocaleDateString("es-PE");
              return { ...item, fechaPublicacion };
            });

            this.jefesRedaccionDetalles.push({
              codigo: jefe.codigo,
              nombre: jefe.name,
              videosProcesados
            });

          } catch (error) {
            console.error(`❌ Error al obtener videos de ${jefe.name}:`, error);
          }
        }

        // Activar primero por defecto si hay alguno
        if (this.jefesRedaccionDetalles.length > 0) {
          this.activeJefeTab = this.jefesRedaccionDetalles[0].codigo;
        }

      } catch (error) {
        console.error("❌ Error al obtener usuarios (jefes de redacción):", error);
      }
    },
    async fetchRedactoresGrupo() {
      this.redactoresDetalles = [];

      try {
        const response = await axios.get(`${this.baseURL}/api/user`);

        const redactoresGrupo = response.data.filter(user =>
            user.role === "REDACTOR" &&
            user.codigo &&
            this.codigoGrupoJefe &&
            user.codigo.startsWith(this.codigoGrupoJefe)
        );

        console.log("✅ Redactores del grupo encontrados:", redactoresGrupo);

        for (const redactor of redactoresGrupo) {
          try {
            const resVideos = await axios.get(`${this.baseURL}/api/personal-videos/${redactor.id}`);

            const videosProcesados = resVideos.data.map((item) => {
              const date = new Date(item.date);
              const fechaPublicacion = date.toLocaleDateString("es-PE");
              return {
                ...item,
                fechaPublicacion
              };
            });

            this.redactoresDetalles.push({
              codigo: redactor.codigo,
              nombre: redactor.name,
              videosProcesados
            });

          } catch (error) {
            console.error(`Error al obtener videos de ${redactor.name}:`, error);
          }
        }

        // Si es la primera vez, selecciona el primero como activo
        if (this.redactoresDetalles.length > 0) {
          this.activeRedactorTab = this.redactoresDetalles[0].codigo;
        }

      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    },
    async fetchStatisticsData() {
      try {
        if (this.isEmpleado) {
          const { data } = await axios.get(`${this.baseURL}/api/personal-videos/${this.userStore.user.id}`);
          this.videos = data;


          this.$nextTick(() => {
            if (this.activeTab === 'semana') this.renderWeeklyChart();
            if (this.activeTab === 'mes') this.renderMonthlyChart();
            if (this.activeTab === 'mesAnterior' && this.showPreviousMonthTab) this.renderPreviousMonthChart();
          });
        } else if (this.isDirectivo) {
          const [resumen, resumenMesPasado, allVideos, top] = await Promise.all([
            axios.get(`${this.baseURL}/api/production`),
            axios.get(`${this.baseURL}/api/production-last-month`),
            axios.get(`${this.baseURL}/api/videos`),
            axios.get(`${this.baseURL}/api/top-producers`)
          ]);

          this.resumenProduccion = resumen.data;
          this.resumenProduccionMesPasado = resumenMesPasado.data;
          this.videos = allVideos.data;
          this.topProducers = top.data;

          this.$nextTick(() => {
            this.renderCharts();
          });
        }
      } catch (error) {
        console.error("❌ Error al cargar estadísticas:", error);
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
            max: this.maxVideosPorDiaPersonalizado,  // 👈 usar el umbral dinámico
            ticks: { stepSize: 1, precision: 0 },
            title: { display: true, text: yLabel },
            grid: { color: "#E0E0E0" }
          },
          x: { grid: { display: false } }
        }
      };
    },

    async renderWeeklyChart() {
      try {
        if (this.weeklyChartInstance) {
          this.weeklyChartInstance.destroy();
          this.weeklyChartInstance = null;
        }

        await this.$nextTick(); // Asegura que el DOM esté listo

        const weekdayNames = ["D", "L", "M", "M", "J", "V", "S"];
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));

        const daysLabels = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          const weekday = weekdayNames[date.getDay()];
          const day = String(date.getDate()).padStart(2, "0");
          return `${weekday}-${day}`;
        });

        const weekly = Array(7).fill(0);
        const now = new Date();

        let totalVideos = 0;
        let videosCaidos = 0;
        let comisionAcumulada = 0;

        const caidoFn = this.isDirectivo ? this.isCaidoDirectivo : this.isCaido;

        this.videos.forEach((v) => {
          const date = new Date(v.date);
          const dayIndex = (date.getDay() + 6) % 7;
          const inThisWeek = date >= startOfWeek && date <= now;

          if (inThisWeek) {
            weekly[dayIndex]++;
            totalVideos++;
            const comision = typeof v.estimatedRevenue === 'number' ? v.estimatedRevenue : parseFloat(v.estimatedRevenue) || 0;
            if (caidoFn.call(this, v)) videosCaidos++;
            else comisionAcumulada += comision;
          }
        });

        const maxEnSemana = Math.max(...weekly);
        if (maxEnSemana > this.maxVideosPorDiaPersonalizado) {
          this.maxVideosPorDiaPersonalizado = maxEnSemana;
        }

        const chartOptions = this.getChartOptions("Videos producidos por día de la semana", "Videos producidos");

        if (this.$refs.weeklyChart) {
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
        }

        this.weekSummary = {
          total: totalVideos,
          caidos: videosCaidos,
          comision: comisionAcumulada.toFixed(2),
          mes: new Date().toLocaleDateString("es-PE", { month: "long", year: "numeric" })
        };
      } catch (error) {
        console.error("Error renderizando gráfico semanal:", error);
      }
    },
    async renderMonthlyChart() {
      try {
        if (this.monthlyChartInstance) {
          this.monthlyChartInstance.destroy();
          this.monthlyChartInstance = null;
        }

        await this.$nextTick();

        const today = new Date();
        const monthToUse = today.getMonth();
        const yearToUse = today.getFullYear();
        const daysInMonth = new Date(yearToUse, monthToUse + 1, 0).getDate();
        const monthlyAdjusted = Array(daysInMonth).fill(0);

        let totalMes = 0;
        let caidosMes = 0;
        let comisionMes = 0;

        // <-- seleccionamos la función de "caído" según el rol
        const caidoFn = this.isDirectivo ? this.isCaidoDirectivo : this.isCaido;

        this.videos.forEach((v) => {
          const date = new Date(v.date);
          if (date.getMonth() === monthToUse && date.getFullYear() === yearToUse) {
            const day = date.getDate() - 1;
            monthlyAdjusted[day]++;
            totalMes++;
            const comision = typeof v.estimatedRevenue === 'number' ? v.estimatedRevenue : parseFloat(v.estimatedRevenue) || 0;
            // usamos la función elegida. .call(this, v) por si la función usa `this`
            if (caidoFn.call(this, v)) caidosMes++;
            else comisionMes += comision;
          }
        });

        const maxEnMes = Math.max(...monthlyAdjusted);
        if (maxEnMes > this.maxVideosPorDiaPersonalizado) {
          this.maxVideosPorDiaPersonalizado = maxEnMes;
        }

        const chartOptions = this.getChartOptions("Videos producidos por día de este mes", "Videos producidos");

        if (this.$refs.monthlyChart) {
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
        }

        this.monthSummary = {
          total: totalMes,
          caidos: caidosMes,
          comision: comisionMes.toFixed(2),
          mes: new Date(yearToUse, monthToUse).toLocaleDateString("es-PE", { month: "long", year: "numeric" })
        };
      } catch (error) {
        console.error("Error renderizando gráfico mensual:", error);
      }
    },
    renderCharts() {
      if (this.activeTab === 'semana' && this.$refs.weeklyChart) {
        this.renderWeeklyChart();
      }
      if (this.activeTab === 'mes' && this.$refs.monthlyChart) {
        this.renderMonthlyChart();
      }
      if (this.activeTab === 'mesAnterior' && this.showPreviousMonthTab && this.$refs.previousMonthChart) {
        this.renderPreviousMonthChart();
      }
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

.monthly-summary,
.weekly-summary {
  text-align: center;
  font-size: 14px;
  color: #333333;
}

.tab-container {
  display: flex;
  justify-content: center; /* centrado horizontal */
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
  border-bottom: 2px solid #007bff;
  color: #007bff;
}

.filter-button {
  background-color: #0056b3;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.filter-button:hover {
  background-color: #003d82;
  transform: scale(1.05);
}

</style>