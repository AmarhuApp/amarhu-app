<template>
  <div class="video-performance">
    <!-- Pestañas -->
    <div class="tab-container">
      <!-- Día 4-7: ambas pestañas -->
      <button
          v-if="isDirectivo || showBothTabs || showOnlyCurrentMonthTab"
          :class="{ 'active-tab': activeTab === 'produccion' }"
          @click="activeTab = 'produccion'">
        Resumen actual
      </button>

      <!-- Día 1-3: solo mes pasado -->
      <button
          v-if="isDirectivo || showOnlyLastMonthTab || showBothTabs"
          :class="{ 'active-tab': activeTab === 'mesPasado' }"
          @click="activeTab = 'mesPasado'">
        Resumen mes pasado
      </button>

      <button
          v-if="showBothTabs"
          :class="{ 'active-tab': activeTab === 'mesPasado' }"
          @click="activeTab = 'mesPasado'">
        Resumen mes pasado
      </button>

      <!-- Directivos: JR's y demás -->
      <button
          v-if="isDirectivo || isJefePrensa"
          :class="{ 'active-tab': activeTab === 'jr' }"
          @click="activeTab = 'jr'">
        Resumen JR's
      </button>

      <button
          v-if="isJefeRedaccion"
          :class="{ 'active-tab': activeTab === 'redactores' }"
          @click="activeTab = 'redactores'">
        Redactores
      </button>
    </div>


    <!-- Contenido de Resumen de Producción -->
    <div v-if="activeTab === 'produccion' || activeTab === 'mesPasado'">
      <h3>Resumen de Producción</h3>

      <p v-if="useLastMonth" class="info-aviso">
        Mostrando datos del mes anterior
      </p>

      <div :class="['horizontal-container', { 'full-width-card': isEmpleado }]">
        <!-- 👤 Empleados -->
        <div v-if="isEmpleado">
          <table v-if="!isLoadingProduction" class="production-table">
            <tbody>
            <tr>
              <td class="label">Total de Videos:</td>
              <td class="value">
                {{ activeTab === 'mesPasado' ? productionDataLastMonth.videosTotales : productionData.videosTotales }}
              </td>
            </tr>
            <tr>
              <td class="label">Videos Caídos:</td>
              <td class="value">
                {{ activeTab === 'mesPasado' ? productionDataLastMonth.videosCaidos : productionData.videosCaidos }}
              </td>
            </tr>
            <tr>
              <td class="label">Videos Productivos:</td>
              <td class="value">
                {{
                  (activeTab === 'mesPasado'
                      ? productionDataLastMonth.videosTotales - productionDataLastMonth.videosCaidos
                      : productionData.videosTotales - productionData.videosCaidos)
                }}
              </td>
            </tr>
            <tr>
              <td class="label">Comisión:</td>
              <td class="value">
                ${{ (activeTab === 'mesPasado' ? productionDataLastMonth.comisionDolares : productionData.comisionDolares)?.toFixed(2) || '0.00' }} USD
              </td>
            </tr>
            </tbody>
          </table>
          <p v-else>Cargando datos personales...</p>
        </div>

        <div v-if="isDirectivo">
          <table v-if="!isLoadingProduction" class="production-table">
            <tbody>
            <tr>
              <td class="label">Total de Videos:</td>
              <td class="value">
                {{ activeTab === 'mesPasado' ? productionDataLastMonth.totalVideos : productionData.totalVideos }}
              </td>
            </tr>
            <tr>
              <td class="label">Videos Caídos:</td>
              <td class="value">
                {{ activeTab === 'mesPasado' ? productionDataLastMonth.videosCaidos : productionData.videosCaidos }}
              </td>
            </tr>
            <tr>
              <td class="label">Ganancia Bruta:</td>
              <td class="value">
                ${{ (activeTab === 'mesPasado' ? productionDataLastMonth.gananciaTotal : productionData.gananciaTotal)?.toFixed(2) || '0.00' }} USD
              </td>
            </tr>
            <tr>
              <td class="label">Ganancia Neta:</td>
              <td class="value">
                ${{ (activeTab === 'mesPasado' ? productionDataLastMonth.gananciaNeta : productionData.gananciaNeta)?.toFixed(2) || '0.00' }} USD
              </td>
            </tr>
            <tr>
              <td class="label">Coste Producción:</td>
              <td class="value">
                ${{ (activeTab === 'mesPasado' ? productionDataLastMonth.costeTotalProduccion : productionData.costeTotalProduccion)?.toFixed(2) || '0.00' }} USD
              </td>
            </tr>
            <tr>
              <td class="label">Total generado por caídos:</td>
              <td class="value">
                ${{ (activeTab === 'mesPasado' ? productionDataLastMonth.totalGeneradoPorCaidos : productionData.totalGeneradoPorCaidos)?.toFixed(2) || '0.00' }} USD
              </td>
            </tr>
            </tbody>
          </table>
          <p v-else>Cargando datos...</p>

          <!-- Radar chart debajo (opcional) -->
          <div ref="chart" class="chart-container" style="margin-top: 20px;">
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
    <div v-if="activeTab === 'jr'">
      <h3>Resumen JR's</h3>

      <div class="ranking-container">
        <div
            class="jr-card"
            v-for="(jefe, index) in sortedJefes"
            :key="jefe.id"
            :class="{ expandida: jefeExpandido === jefe.codigo }"
        >
          <transition name="fade-expand">
            <div>
              <!-- Card minimizada -->
              <div v-if="jefeExpandido !== jefe.codigo" @click="expandirJefe(jefe)" class="jr-card-content">
                <div class="jr-header">
                  <span class="jr-position">#{{ index + 1 }}</span>
                  <span class="jr-name">{{ jefe.nombre }}</span>
                </div>
                <div class="jr-stats">
                  <div class="jr-stat-item">
                    <span class="jr-stat-label">Producción Total</span>
                    <span class="jr-stat-value">{{ jefe.totalVideos }}</span>
                  </div>
                  <div class="jr-stat-item">
                    <span class="jr-stat-label">Videos Caídos</span>
                    <span class="jr-stat-value">{{ jefe.videosCaidos }}</span>
                  </div>
                  <div class="jr-stat-item">
                    <span class="jr-stat-label">Ganancia Bruta</span>
                    <span class="jr-stat-value">${{ jefe.gananciaTotal?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div class="jr-stat-item">
                    <span class="jr-stat-label">Ganancias Netas</span>
                    <span class="jr-stat-value">${{ jefe.gananciaNeta?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div class="jr-stat-item">
                    <span class="jr-stat-label">Coste Producción</span>
                    <span class="jr-stat-value">${{ jefe.costeTotalProduccion?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div class="jr-stat-item">
                    <span class="jr-stat-label">Total generado por caídos</span>
                    <span class="jr-stat-value">${{ jefe.totalGeneradoPorCaidos?.toFixed(2) || '0.00' }}</span>
                  </div>
                </div>
              </div>

              <!-- Card expandida -->
              <div v-else class="jr-card-expandida">
                <button @click="jefeExpandido = null" class="volver-btn">⬅ Volver</button>

                <div class="table-container">
                  <table class="reports-table">
                    <thead>
                    <tr>
                      <th>#</th>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Views</th>
                      <th>Monto Redactor</th>
                      <th>Tiempo de Vista (s)</th>
                      <th>RPM</th>
                      <th>Categoría</th>
                      <th>Color</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr
                        v-for="(item, i) in detallesPorJefe[jefe.codigo]"
                        :key="item.videoId"
                    >
                      <td>{{ i + 1 }}</td>
                      <td style="font-family: monospace">{{ item.videoId }}</td>
                      <td>{{ item.title }}</td>
                      <td>{{ item.fechaPublicacion }}</td>
                      <td>{{ item.horaPublicacion }}</td>
                      <td>{{ item.views }}</td>
                      <td>${{ item.montoEmpleado.toFixed(4) }}</td>
                      <td>{{ item.averageViewDuration }}</td>
                      <td>{{ item.rpm }}</td>
                      <td>{{ item.categoria }}</td>
                      <td>
                        <div :style="{
                        backgroundColor: item.colorCategoria,
                        width: '50px',
                        height: '20px',
                        borderRadius: '4px',
                        margin: 'auto'
                      }"></div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>


    <!-- Contenido de Redactores (para Jefe de Redacción) -->
    <div v-if="activeTab === 'redactores'">
      <h3>Redactores</h3> <!-- Título queda centrado arriba -->

      <div class="ranking-container">
        <div
            class="redactor-card"
            v-for="(redactor, index) in redactoresFiltrados"
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
      jefeExpandido: null, // Código del jefe actualmente expandido
      detallesPorJefe: {},
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
    async expandirJefe(jefe) {
      if (this.jefeExpandido === jefe.codigo) {
        this.jefeExpandido = null;
        return;
      }

      this.jefeExpandido = jefe.codigo;

      if (!this.detallesPorJefe[jefe.codigo]) {
        try {
          // Obtener todos los usuarios
          const responseUsuarios = await axios.get("https://api.pa-reporte.com/api/user");

          // Buscar al jefe por código
          const jefeCompleto = responseUsuarios.data.find(u =>
              u.role === "JEFE_REDACCION" && u.codigo === jefe.codigo
          );

          if (!jefeCompleto) {
            console.warn(`⚠️ No se encontró al jefe con código ${jefe.codigo}`);
            return;
          }

          // Usar su ID real para consultar sus videos
          const responseVideos = await axios.get(`https://api.pa-reporte.com/api/personal-videos/${jefeCompleto.id}`);
          const procesados = this.procesarVideos(responseVideos.data);
          this.detallesPorJefe[jefe.codigo] = procesados;

        } catch (error) {
          console.error(`❌ Error al obtener detalles de ${jefe.nombre}:`, error);
        }
      }
    },

    procesarVideos(videos) {
      const today = new Date();
      const day = today.getDate();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      return videos.filter((item) => {
        const date = new Date(item.date);
        const videoMonth = date.getMonth();
        const videoYear = date.getFullYear();
        if (day <= 7) {
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return (videoMonth === currentMonth && videoYear === currentYear) ||
              (videoMonth === lastMonth && videoYear === lastYear);
        } else {
          return videoMonth === currentMonth && videoYear === currentYear;
        }
      }).map((item) => {
        const montoEmpleado = (item.estimatedRevenue >= 10)
            ? item.estimatedRevenue * 0.166452
            : 0;

        let categoria = "Sin Clasificación";
        let colorCategoria = "#BDC3C7";
        const rawRpm = item.rpm ? parseFloat(item.rpm) : 0;
        const rpm = parseFloat((rawRpm * 0.9).toFixed(2));

        if (rpm < 0.95) {
          categoria = "Extremadamente Bajo";
          colorCategoria = "#C0392B";
        } else if (rpm <= 1.41) {
          categoria = "Bajo Impacto";
          colorCategoria = "#E74C3C";
        } else if (rpm <= 1.92) {
          categoria = "Buen Impacto";
          colorCategoria = "#F1C40F";
        } else if (rpm <= 2.41) {
          categoria = "Alto Impacto";
          colorCategoria = "#3498DB";
        } else {
          categoria = "Impacto Sobresaliente";
          colorCategoria = "#27AE60";
        }

        const fecha = new Date(item.date);
        return {
          ...item,
          fechaPublicacion: fecha.toLocaleDateString("es-PE"),
          horaPublicacion: fecha.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false }),
          montoEmpleado,
          categoria,
          colorCategoria,
          rpm
        };
      });
    },
    async loadDataBasedOnRole() {
      console.log("🔍 Verificando rol: Directivo =", this.isDirectivo);
      try {
        const today = new Date();
        const day = today.getDate();

        if (this.isDirectivo) {
          await this.fetchProductionData(); // directivo: ya hace ambos
        } else {
          // Empleado: SIEMPRE cargar ambos, para que las pestañas funcionen
          await Promise.all([
            this.fetchPersonalProduction(),
            this.fetchPersonalProductionLastMonth()
          ]);
        }

        await this.fetchJRData();
        await this.fetchTopVideos();

        if (this.isJefeRedaccion) {
          await this.fetchRedactores();
        }

      } catch (error) {
        console.error("❌ Error al cargar datos según rol:", error);
      }
    },
    async fetchRedactores() {
      if (!this.isJefeRedaccion) return;

      try {
        const response = await axios.get(`${this.baseURL}/api/user`);

        const redactoresGrupo = response.data.filter(user =>
            user.role === "REDACTOR" &&
            user.codigo &&
            this.grupoRedactores &&
            user.codigo.startsWith(this.grupoRedactores)
        );

        console.log("✅ Redactores del grupo encontrados:", redactoresGrupo);

        // Ahora traemos su producción:
        const redactoresConProduccion = await Promise.all(
            redactoresGrupo.map(async (redactor) => {
              try {
                const resVideos = await axios.get(`${this.baseURL}/api/personal-videos/${redactor.id}`);
                const videos = resVideos.data;

                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                let total = 0;
                let caidos = 0;
                let comision = 0;

                videos.forEach((v) => {
                  const date = new Date(v.date);
                  const isSameMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;
                  if (isSameMonth) {
                    total++;
                    const revenue = typeof v.estimatedRevenue === 'number' ? v.estimatedRevenue : parseFloat(v.estimatedRevenue) || 0;
                    if (revenue < 1.66452) {
                      caidos++;
                    } else {
                      comision += revenue;
                    }
                  }
                });

                return {
                  codigo: redactor.codigo,
                  nombre: redactor.name,
                  videosTotales: total,
                  videosCaidos: caidos,
                  comisionDolares: comision.toFixed(2)
                };
              } catch (error) {
                console.error(`Error al obtener videos de ${redactor.name}:`, error);
                return null;
              }
            })
        );

        // Filtramos los que sí se cargaron bien:
        this.redactores = redactoresConProduccion.filter(r => r !== null);

      } catch (error) {
        console.error("Error al obtener redactores:", error);
      }
    },
    async fetchPersonalProduction() {
      this.isLoadingProduction = true;
      try {
        const response = await axios.get(`${this.baseURL}/api/personal-videos/${this.userStore.user.id}`);
        const videos = response.data;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let total = 0;
        let caidos = 0;
        let comision = 0;

        videos.forEach((v) => {
          const date = new Date(v.date);
          const isSameMonth = date.getMonth() === currentMonth && date.getFullYear() === currentYear;
          if (isSameMonth) {
            total++;
            const revenue = typeof v.estimatedRevenue === 'number' ? v.estimatedRevenue : parseFloat(v.estimatedRevenue) || 0;
            if (revenue < 1.66452) {
              caidos++;
            } else {
              comision += revenue;
            }
          }
        });

        this.productionData = {
          user: this.userStore.user,
          videosTotales: total,
          videosCaidos: caidos,
          comisionDolares: comision,
        };
      } catch (error) {
        console.error("❌ Error al obtener y calcular producción personal:", error.message);
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
      this.isLoadingProduction = true; // también puedes poner esto al inicio para mayor claridad
      try {
        const response = await axios.get(`${this.baseURL}/api/production`);
        Object.assign(this.productionData, response.data);

        const lastMonthResponse = await axios.get(`${this.baseURL}/api/production-last-month`);
        this.productionDataLastMonth = lastMonthResponse.data;

        this.renderChart();
      } catch (error) {
        console.error("❌ Error capturado:", error.message);
      } finally {
        this.isLoadingProduction = false; // 🚩 NECESARIO
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
      try {
        if (this.isEmpleado) {
          const response = await axios.get(
              `${this.baseURL}/api/personal-videos/${this.userStore.user.id}`
          );
          this.topVideos = response.data
              .sort((a, b) => b.estimatedRevenue - a.estimatedRevenue)
              .slice(0, 5);
        } else {
          // Para evitar errores en templates que lo usen:
          this.topVideos = []; // 🟢 evita null o undefined
        }
      } catch (error) {
        console.error("Error al obtener los mejores videos:", error.message);
        this.topVideos = []; // fallback seguro
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
    grupoRedactores() {
      if (this.userStore.user.role !== "JEFE_REDACCION") return null;
      const codigoJefe = this.userStore.user.codigo; // Ejemplo: "JR5"
      const grupo = codigoJefe.substring(2); // obtiene "5"
      return `RA${grupo}`;
    },
    redactoresFiltrados() {
      if (this.userStore.user.role !== "JEFE_REDACCION" || !this.redactores) return [];
      const prefijo = this.grupoRedactores;
      return this.redactores.filter(redactor => redactor.codigo.startsWith(prefijo));
    },
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
    sortedJefes() {
      return this.jrData
          ? [...this.jrData].sort((a, b) => b.gananciaPromedio - a.gananciaPromedio)
          : [];
    },
    showOnlyLastMonthTab() {
      const day = new Date().getDate();
      return this.isEmpleado && day >= 1 && day <= 3;
    },
    showBothTabs() {
      const day = new Date().getDate();
      return this.isEmpleado && day >= 4 && day <= 7;
    },
    showOnlyCurrentMonthTab() {
      const day = new Date().getDate();
      return this.isEmpleado && day >= 8;
    },
    useLastMonth() {
      // Útil para el aviso de "Mostrando mes pasado"
      return this.isEmpleado && (this.showOnlyLastMonthTab || (this.showBothTabs && this.activeTab === 'mesPasado'));
    }
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
  border-radius: 5px;
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

/* Tarjeta para cada Redactor */
.redactor-card {
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

.redactor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
}

/* Encabezado con posición y nombre */
.redactor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 15px;
}

.redactor-position {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}

.redactor-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-left: 10px;
}

/* Contenedor de estadísticas */
.redactor-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 10px;
  column-gap: 15px;
  width: 100%;
}

.redactor-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.redactor-stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.redactor-stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.jr-card {
  background-color: white;
  margin: 1.2rem 0;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: all 0.4s ease;
}

.jr-card.expandida {
  transform: scale(1.01);
  border: 2px solid #1976d2;
}

.jr-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
}

.jr-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 1rem;
}

.jr-stat-item {
  flex: 1 1 30%;
  margin-bottom: 1rem;
  min-width: 160px;
}

.jr-stat-label {
  font-weight: 500;
  color: #666;
}

.jr-stat-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #222;
}

.volver-btn {
  background-color: #f1f1f1;
  color: #1976d2;
  border: none;
  padding: 0.4rem 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.volver-btn:hover {
  background-color: #e2e2e2;
}

.table-container {
  overflow-x: auto;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.reports-table th, .reports-table td {
  padding: 0.6rem 0.8rem;
  text-align: center;
  border: 1px solid #ddd;
}

.reports-table thead {
  background-color: #f5f5f5;
}

.reports-table tbody tr:hover {
  background-color: #f9f9f9;
}

.reports-table th {
  font-weight: 600;
  color: #444;
}

.reports-table td {
  color: #333;
}

.reports-table td:nth-child(2) {
  font-family: monospace;
  font-size: 0.85rem;
}

.fade-expand-enter-active,
.fade-expand-leave-active {
  transition: all 0.4s ease;
}
.fade-expand-enter-from,
.fade-expand-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

</style>
