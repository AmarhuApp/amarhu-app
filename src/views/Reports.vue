<template>
  <div class="reports">
    <h1>{{ isEmpleado ? 'Detalles de Producción' : 'Reportes de Videos Producidos' }}</h1>

    <!-- Botón de Filtros y Barra de Búsqueda -->
    <div class="filters-container">
      <button @click="toggleFilterMenu" class="filter-button">Filtros</button>
      <div v-if="showFilterMenu" class="filter-menu">
        <button @click="setFilter('videos')">Videos</button>
        <button @click="setFilter('caidos')">Videos Caídos</button>
        <button v-if="!isEmpleado || isDirectivo" @click="setFilter('pagos')">Leyenda de Pagos</button>
        <button v-if="isJefeRedaccion" @click="setFilter('redactores')">Redactores</button>
        <button v-if="isDirectivo" @click="setFilter('grupo-redactores')">Producción Redactores</button>
      </div>

      <div class="search-container">
        <span class="material-icons search-icon" @click="toggleSearchBar">search</span>
        <input
            type="text"
            class="search-bar"
            :class="{ expanded: searchExpanded }"
            placeholder="Buscar..."
            v-model="searchQuery"
            @input="filterData"
        />
      </div>
    </div>

    <!-- Resumen -->
    <div class="summary">
      <span>Total: {{ filteredData.length }}</span>
    </div>


    <!-- Tabla -->
    <div class="table-container" ref="tableContainer">
      <table class="reports-table">
        <thead>
        <tr>
          <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">#</th>
          <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">ID</th>
          <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">Titulo</th>
          <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">Fecha</th>
          <th v-if="!isEmpleado && (currentFilter === 'videos' || currentFilter === 'caidos')">Views</th>
          <th v-if="!isEmpleado && (currentFilter === 'videos' || currentFilter === 'caidos')">Revenue Estimado</th>
          <th v-if="!isEmpleado && (currentFilter === 'videos' || currentFilter === 'caidos')">WVD</th>
          <th v-if="!isEmpleado && (currentFilter === 'videos' || currentFilter === 'caidos')">RPM</th>

          <!-- Condicional para empleados -->
          <template v-if="isEmpleado && (currentFilter === 'videos' || currentFilter === 'caidos')">
            <th>Hora</th>
            <th>Visualización</th>
            <th>Monto Redactor</th>
            <th>Tiempo de Vista (s)</th>
            <th>RPM Real</th>
            <th>Categoría</th>
            <th>Color</th>
          </template>

          <th v-if="currentFilter === 'pagos'">Código</th>
          <th v-if="currentFilter === 'pagos'">Nombre</th>
          <th v-if="currentFilter === 'pagos'">Videos Totales</th>
          <th v-if="currentFilter === 'pagos'">Videos Caídos</th>
          <th v-if="currentFilter === 'pagos'">Ganancia Total</th>
          <th v-if="currentFilter === 'pagos'">Ganancia Total menos Impuestos</th>
          <th v-if="currentFilter === 'pagos'">Ganancia después de Caídos e Impuestos</th>
          <th v-if="currentFilter === 'pagos'">Comisión $</th>
          <th v-if="currentFilter === 'pagos'">Comisión S/.</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(item, index) in filteredData"
            :key="item.id"
            v-if="currentFilter === 'videos' || currentFilter === 'caidos'"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ item.videoId }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.fechaPublicacion }}</td>

          <!-- Normal para directivos -->
          <template v-if="!isEmpleado">
            <td>{{ item.views }}</td>
            <td>{{ item.estimatedRevenue }}</td>
            <td>{{ item.averageViewDuration }}</td>
            <td>{{ item.rpm }}</td>
          </template>

          <!-- Para empleados -->
          <template v-else>
            <td>{{ item.horaPublicacion }}</td>
            <td>{{ item.views }}</td>
            <td>
                <span v-if="item.estimatedRevenue">
                  ${{ (item.estimatedRevenue).toFixed(4) }}
                </span>
              <span v-else>-</span>
            </td>
            <td>{{ item.averageViewDuration }}</td>
            <td>{{ item.rpm || '-' }}</td>
            <td>{{ item.categoria }}</td>
            <td>
              <div
                  :style="{
                backgroundColor: item.colorCategoria,
                width: '50px',
                height: '20px',
                borderRadius: '4px',
                margin: 'auto'
              }"
              ></div>

            </td>
          </template>
        </tr>

        <tr
            v-for="(pago, index) in filteredData"
            :key="pago.codigo"
            v-if="currentFilter === 'pagos'"
        >
          <td>{{ pago.codigo }}</td>
          <td>{{ pago.nombre }}</td>
          <td>{{ pago.videosTotales }}</td>
          <td>{{ pago.videosCaidos }}</td>
          <td>{{ pago.gananciaTotal }}</td>
          <td>{{ pago.gananciaMenosImpuestos }}</td>
          <td>{{ pago.gananciaDespuesCaidos }}</td>
          <td>{{ pago.comisionDolares }}</td>
          <td>{{ pago.comisionSoles }}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <!-- Pestañas de Redactores (solo si filtro 'redactores' activo) -->
    <div v-if="currentFilter === 'redactores'" class="redactor-tabs">

      <!-- Pestañas con nombre de cada redactor -->
      <div class="tab-container">
        <button
            v-for="(redactor, index) in redactoresDetalles"
            :key="redactor.codigo"
            :class="{ 'active-tab': activeRedactorTab === redactor.codigo }"
            @click="activeRedactorTab = redactor.codigo"
        >
          {{ redactor.nombre }}
        </button>
      </div>

      <!-- Tabla de videos del redactor activo -->
      <div v-if="redactorActivoDetalle" class="table-container">
        <table class="reports-table">
          <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Título</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Visualización</th>
            <th>Monto Redactor</th>
            <th>Tiempo de Vista (s)</th>
            <th>RPM Real</th>
            <th>Categoría</th>
            <th>Color</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(item, index) in redactorActivoDetalle.videosProcesados"
              :key="item.videoId"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.videoId }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.fechaPublicacion }}</td>
            <td>{{ item.horaPublicacion }}</td>
            <td>{{ item.views }}</td>
            <td>${{ item.montoEmpleado.toFixed(4) }}</td>
            <td>{{ item.averageViewDuration }}</td>
            <td>{{ item.rpm }}</td>
            <td>{{ item.categoria }}</td>
            <td>
              <div
                  :style="{
                backgroundColor: item.colorCategoria,
                width: '50px',
                height: '20px',
                borderRadius: '4px',
                margin: 'auto'
              }"
              ></div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="currentFilter === 'grupo-redactores'" class="grupo-redactores-tabs">
      <!-- Pestañas de jefes -->
      <div class="tab-container jefe-tabs">
        <button
            v-for="(grupo, codigoJefe) in grupoRedactores"
            :key="codigoJefe"
            :class="{ 'active-tab': jefeSeleccionado?.codigo === codigoJefe }"
            @click="selectJefe(codigoJefe)"
        >
          {{ grupo.nombreJefe }}
        </button>
      </div>

      <!-- Pestañas de redactores dentro del jefe seleccionado -->
      <div v-if="jefeSeleccionado && grupoRedactores[jefeSeleccionado.codigo]" class="tab-container redactor-tabs">
        <button
            v-for="redactor in grupoRedactores[jefeSeleccionado.codigo].redactores"
            :key="redactor.codigo"
            :class="{ 'active-tab': activeRedactorTab === redactor.codigo }"
            @click="activeRedactorTab = redactor.codigo"
        >
          {{ redactor.name }}
        </button>
      </div>

      <!-- Tabla de producción del redactor activo -->
      <div v-if="activeRedactor" class="table-container">
        <table class="reports-table">
          <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Título</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Visualización</th>
            <th>Monto Redactor</th>
            <th>Tiempo de Vista (s)</th>
            <th>RPM Real</th>
            <th>Categoría</th>
            <th>Color</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(item, index) in activeRedactor.videosProcesados"
              :key="item.videoId"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.videoId }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.fechaPublicacion }}</td>
            <td>{{ item.horaPublicacion }}</td>
            <td>{{ item.views }}</td>
            <td>${{ item.montoEmpleado.toFixed(4) }}</td>
            <td>{{ item.averageViewDuration }}</td>
            <td>{{ item.rpm }}</td>
            <td>{{ item.categoria }}</td>
            <td>
              <div
                  :style="{
                backgroundColor: item.colorCategoria,
                width: '50px',
                height: '20px',
                borderRadius: '4px',
                margin: 'auto'
              }"
              ></div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useUserStore } from "@/store/user";

export default {
  name: "Reports",
  data() {
    return {
      activeRedactorTab: null,
      redactoresDetalles: [],
      videos: [],
      caidos: [],
      pagos: [],
      filteredData: [],
      searchQuery: "",
      currentFilter: "videos", // Por defecto se muestran todos los videos
      showFilterMenu: false,
      searchExpanded: false, // Controla la expansión de la barra de búsqueda
      grupoRedactores: {},
      jefeSeleccionado: null,
      activeTab: 'grupo-redactores',
    };
  },
  computed: {
    redactorActivoDetalle() {
      return this.redactoresDetalles.find(r => r.codigo === this.activeRedactorTab) || null;
    },
    userStore() {
      return useUserStore();
    },
    isDirectivo() {
      return this.userStore.user.role === "DIRECTIVO";
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
    isJefeRedaccion() {
      return this.userStore.user.role === "JEFE_REDACCION";
    },
    codigoGrupoJefe() {
      if (this.isJefeRedaccion && this.userStore.user.codigo) {
        // Si el jefe es JR5 → devuelve "RA5"
        const match = this.userStore.user.codigo.match(/^JR(\d+)/);
        if (match) {
          return `RA${match[1]}`;
        }
      }
      return null;
    },
    redactoresFiltradosPagos() {
      if (this.codigoGrupoJefe && this.pagos.length > 0) {
        return this.pagos.filter(p => p.codigo.startsWith(this.codigoGrupoJefe));
      }
      return [];
    },
    activeRedactor() {
      if (!this.jefeSeleccionado || !this.activeRedactorTab) return null;
      const grupo = this.grupoRedactores[this.jefeSeleccionado.codigo];
      return grupo?.redactores.find(r => r.codigo === this.activeRedactorTab) || null;
    },
  },
  created() {
    console.log("🔍 userStore.user:", this.userStore.user);

    if (this.isEmpleado) {
      this.fetchPersonalVideos();
    } else if (this.isDirectivo) {
      this.jefeSeleccionado = this.userStore.user;
      this.fetchVideos();
      this.fetchCaidos();
      this.fetchPagos();
      this.fetchRedactoresPorGrupoJefe();
    } else {
      console.warn("⚠️ Role no manejado:", this.userStore.user.role);
    }
  },
  methods: {
    filterByDateRange(videos) {
      const today = new Date();
      const day = today.getDate();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();

      return videos.filter((video) => {
        const date = new Date(video.date);
        const videoMonth = date.getMonth();
        const videoYear = date.getFullYear();

        if (day <= 7) {
          // Mostrar videos del mes actual y anterior
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
          const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
          return (
              (videoMonth === currentMonth && videoYear === currentYear) ||
              (videoMonth === lastMonth && videoYear === lastMonthYear)
          );
        } else {
          // Mostrar solo videos del mes actual
          return videoMonth === currentMonth && videoYear === currentYear;
        }
      });
    },
    async fetchDetallesRedactores() {
      this.redactoresDetalles = [];

      for (const redactor of this.redactoresFiltradosPagos) {
        try {
          const response = await axios.get(`https://api.pa-reporte.com/api/personal-videos/${redactor.codigo}`);

          const videosProcesados = this.filterByDateRange(response.data).map((item) => {
            const montoEmpleado = Number(item.estimatedRevenue);


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
            } else if (rpm > 2.41) {
              categoria = "Impacto Sobresaliente";
              colorCategoria = "#27AE60";
            }

            const fechaOriginal = new Date(item.date);
            const fechaPublicacion = fechaOriginal.toLocaleDateString("es-PE");
            const horaPublicacion = fechaOriginal.toLocaleTimeString("es-PE", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            });

            return {
              ...item,
              montoEmpleado,
              categoria,
              colorCategoria,
              fechaPublicacion,
              horaPublicacion,
              rpm,
            };
          });

          this.redactoresDetalles.push({
            codigo: redactor.codigo,
            nombre: redactor.nombre,
            videosProcesados
          });

        } catch (error) {
          console.error(`Error al obtener videos de ${redactor.nombre}:`, error);
        }
      }
    },
    async fetchRedactoresPorGrupoJefe() {
      try {
        const response = await axios.get("https://api.pa-reporte.com/api/user");
        const users = response.data;

        // Filtra solo jefes de redacción
        const jefes = users.filter(user => user.role === "JEFE_REDACCION");

        // Reinicia el objeto de grupos
        this.grupoRedactores = {};

        for (const jefe of jefes) {
          const grupoJefe = jefe.codigo?.match(/\d+/)?.[0]; // "JR6" → "6"

          // Redactores cuyo código es RA6xxx
          const redactoresGrupo = users.filter(user => {
            const grupoRedactor = user.codigo?.match(/RA(\d)/)?.[1]; // "RA6001" → "6"
            return (
                user.role === "REDACTOR" &&
                grupoRedactor === grupoJefe
            );
          });

          // Inicializa grupo
          this.grupoRedactores[jefe.codigo] = {
            nombreJefe: jefe.name || jefe.nombre || "Jefe",
            redactores: [],
          };

          for (const redactor of redactoresGrupo) {
            try {
              const resVideos = await axios.get(`https://api.pa-reporte.com/api/personal-videos/${redactor.id}`);
              const videosFiltrados = this.filterByDateRange(resVideos.data);

              const videosProcesados = videosFiltrados.map((item) => {
                const montoEmpleado = Number(item.estimatedRevenue);

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
                } else if (rpm > 2.41) {
                  categoria = "Impacto Sobresaliente";
                  colorCategoria = "#27AE60";
                }

                const fechaOriginal = new Date(item.date);
                const fechaPublicacion = fechaOriginal.toLocaleDateString("es-PE");
                const horaPublicacion = fechaOriginal.toLocaleTimeString("es-PE", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                });

                return {
                  ...item,
                  montoEmpleado,
                  categoria,
                  colorCategoria,
                  fechaPublicacion,
                  horaPublicacion,
                  rpm,
                };
              });

              // Agrega redactor y sus videos al grupo correspondiente
              this.grupoRedactores[jefe.codigo].redactores.push({
                ...redactor,
                videosProcesados,
              });

            } catch (error) {
              console.error(`❌ Error al obtener videos de ${redactor.name}:`, error);
            }
          }
        }

        // Activa el primer grupo como pestaña por defecto
        const primerCodigoGrupo = Object.keys(this.grupoRedactores)[0];
        if (primerCodigoGrupo) {
          this.activeTab = primerCodigoGrupo;
        }

      } catch (error) {
        console.error("❌ Error al obtener usuarios:", error);
      }
    },
    async fetchRedactoresGrupo() {
      this.redactoresDetalles = [];

      try {
        const response = await axios.get("https://api.pa-reporte.com/api/user");

        // Filtramos los redactores del grupo del jefe actual
        const redactoresGrupo = response.data.filter(user =>
            user.role === "REDACTOR" &&
            user.codigo &&
            this.codigoGrupoJefe &&
            user.codigo.startsWith(this.codigoGrupoJefe)
        );

        console.log("✅ Redactores del grupo encontrados:", redactoresGrupo);

        // Por cada redactor, traemos sus videos
        for (const redactor of redactoresGrupo) {
          try {
            const resVideos = await axios.get(`https://api.pa-reporte.com/api/personal-videos/${redactor.id}`);

            const videosProcesados = this.filterByDateRange(resVideos.data).map((item) => {
              const montoEmpleado = Number(item.estimatedRevenue);

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
              } else if (rpm > 2.41) {
                categoria = "Impacto Sobresaliente";
                colorCategoria = "#27AE60";
              }

              const fechaOriginal = new Date(item.date);
              const fechaPublicacion = fechaOriginal.toLocaleDateString("es-PE");
              const horaPublicacion = fechaOriginal.toLocaleTimeString("es-PE", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              });

              return {
                ...item,
                montoEmpleado,
                categoria,
                colorCategoria,
                fechaPublicacion,
                horaPublicacion,
                rpm,
              };
            });

            // Añadimos al arreglo de redactoresDetalles
            this.redactoresDetalles.push({
              codigo: redactor.codigo,
              nombre: redactor.name,  // Cuidado: algunos APIs usan "name", otros "nombre"
              videosProcesados
            });

          } catch (error) {
            console.error(`Error al obtener videos de ${redactor.name}:`, error);
          }
        }

      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    },
    async fetchPersonalVideos() {
      try {
        const response = await axios.get(`https://api.pa-reporte.com/api/personal-videos/${this.userStore.user.id}`);
        this.videos = this.filterByDateRange(response.data).map((item) => {
          const montoEmpleado = Number(item.estimatedRevenue);

          let categoria = "Sin Clasificación";
          let colorCategoria = "#BDC3C7"; // Gris por defecto
          const rawRpm = item.rpm ? parseFloat(item.rpm) : 0;
          const rpm = parseFloat((rawRpm * 0.9).toFixed(2)); // Aplica reducción del 10%


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
          } else if (rpm > 2.41) {
            categoria = "Impacto Sobresaliente";
            colorCategoria = "#27AE60";
          }

          const fechaOriginal = new Date(item.date);
          const fechaPublicacion = fechaOriginal.toLocaleDateString("es-PE");
          const horaPublicacion = fechaOriginal.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          return {
            ...item,
            montoEmpleado,
            categoria,
            colorCategoria,
            fechaPublicacion,
            horaPublicacion,
            rpm,
          };
        });

        if (this.currentFilter === "videos") {
          this.filteredData = this.videos;
        }
      } catch (error) {
        console.error("❌ Error al obtener videos personales:", error);
      }
    },
    async fetchVideos() {
      try {
        const response = await axios.get("https://api.pa-reporte.com/api/videos");
        this.videos = this.filterByDateRange(response.data).map(item => {
          const fechaOriginal = new Date(item.date);
          const fechaPublicacion = fechaOriginal.toLocaleDateString("es-PE");
          return {
            ...item,
            fechaPublicacion
          };
        });
        if (this.currentFilter === "videos") {
          this.filteredData = this.videos;
        }
      } catch (error) {
        console.error("❌ Error al obtener los videos:", error);
      }
    },
    async fetchCaidos() {
      try {
        const response = await axios.get("https://api.pa-reporte.com/api/caidos");
        this.caidos = this.filterByDateRange(response.data);
        if (this.currentFilter === "caidos") {
          this.filteredData = this.caidos;
        }
      } catch (error) {
        console.error("❌ Error al obtener los videos caídos:", error);
      }
    },
    async fetchPagos() {
      try {
        const response = await axios.get("https://api.pa-reporte.com/api/pagos");
        this.pagos = response.data;
        if (this.currentFilter === "pagos") {
          this.filteredData = this.pagos;
        }
      } catch (error) {
        console.error("❌ Error al obtener leyenda de pagos:", error);
      }
    },
    setFilter(filter) {
      this.currentFilter = filter;

      if (filter === "videos") {
        this.filteredData = this.videos;
      } else if (filter === "caidos") {
        this.filteredData = this.caidos;
      } else if (filter === "pagos") {
        this.fetchPagos();
      } else if (filter === "redactores") {
        // 🔥 Aquí ya NO necesitas esperar "pagos", porque se basa en /api/users
        this.fetchRedactoresGrupo();
      } else if (filter === "grupo-redactores") {
        this.fetchRedactoresPorGrupoJefe()
      }

      this.showFilterMenu = false;
    },

    filterData() {
      const query = this.searchQuery.toLowerCase();
      if (this.currentFilter === "videos" || this.currentFilter === "caidos") {
        this.filteredData = this[this.currentFilter].filter((item) =>
            item.title.toLowerCase().includes(query)
        );
      } else if (this.currentFilter === "pagos") {
        this.filteredData = this.pagos.filter((pago) =>
            pago.nombre.toLowerCase().includes(query)
        );
      }
    },
    selectJefe(codigoJefe) {
      this.jefeSeleccionado = {
        codigo: codigoJefe,
        name: this.grupoRedactores[codigoJefe].nombreJefe
      };
      const redactores = this.grupoRedactores[codigoJefe]?.redactores || [];
      this.activeRedactorTab = redactores[0]?.codigo || null;
    },
    toggleFilterMenu() {
      this.showFilterMenu = !this.showFilterMenu;
    },
    toggleSearchBar() {
      this.searchExpanded = !this.searchExpanded;
      if (!this.searchExpanded) {
        this.searchQuery = "";
        this.filterData();
      }
    },
  },
};
</script>

<style scoped>

.reports {
  padding: 20px;
}

h1 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.filters-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
  position: relative;
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

.filter-menu {
  display: flex;
  flex-direction: column;
  position: absolute;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 100;
}

.filter-menu button {
  background: none;
  border: none;
  color: #333;
  padding: 5px 10px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.3s ease;
}

.filter-menu button:hover {
  background-color: #f5f5f5;
}

.search-container {
  display: flex;
  align-items: center;
  position: relative;
}

.search-icon {
  font-size: 24px;
  color: #555;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.search-icon:hover {
  transform: scale(1.2);
}

.search-bar {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: 0;
  opacity: 0;
  transition: width 0.3s ease, opacity 0.3s ease;
  margin-left: 10px;
}

.search-bar.expanded {
  width: 200px;
  opacity: 1;
}

.search-bar:focus {
  outline: none;
  border-color: #0056b3;
}

.summary {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #555;
}

.table-container {
  overflow-x: auto;
  white-space: nowrap;
  margin-top: 10px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Opcional: evita doble scroll innecesario */
.reports-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1000px; /* O ajusta según tus columnas */
}


.reports-table th,
.reports-table td {
  padding: 12px 15px;
  text-align: left;
  color: #181818;
}

.reports-table thead th {
  background-color: #f5f5f5;
  font-size: 16px;
  font-weight: 600;
  color: #555;
}

.reports-table tbody tr {
  border-bottom: 1px solid #eee;
}

.reports-table tbody tr:hover {
  background-color: #f9f9f9;
}

.table-container {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 555px; /* o lo que desees */
  position: relative;
}

.reports-table thead th {
  position: sticky;
  top: 0;
  background-color: #f5f5f5; /* Para que no se mezcle con el fondo al hacer scroll */
  z-index: 2; /* Asegura que esté por encima del contenido */
  font-size: 16px;
  font-weight: 600;
  color: #555;
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

</style>

