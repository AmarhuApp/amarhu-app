<template>
  <div class="reports">
    <h1>Reportes de Videos Producidos</h1>

    <!-- Botón de Filtros y Barra de Búsqueda -->
    <div class="filters-container">
      <!-- Botón de Filtros -->
      <button @click="toggleFilterMenu" class="filter-button">Filtros</button>
      <div v-if="showFilterMenu" class="filter-menu">
        <button @click="setFilter('videos')">Videos</button>
        <button @click="setFilter('caidos')">Videos Caídos</button>
        <button @click="setFilter('pagos')">Leyenda de Pagos</button>
      </div>

      <!-- Barra de búsqueda con lupa -->
      <div class="search-container">
        <span
            class="material-icons search-icon"
            @click="toggleSearchBar"
        >
          search
        </span>
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
    <table class="reports-table">
      <thead>
      <tr>
        <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">#</th>
        <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">ID</th>
        <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">Titulo</th>
        <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">Fecha</th>
        <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">Views</th>
        <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">Revenue Estimado</th>
        <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">WVD</th>
        <th v-if="currentFilter === 'videos' || currentFilter === 'caidos'">RPM</th>

        <!-- Columnas de la tabla de Leyenda de Pagos -->
        <th v-if="currentFilter === 'pagos'">Código</th>
        <th v-if="currentFilter === 'pagos'">Nombre</th>
        <th v-if="currentFilter === 'pagos'">Videos Totales</th>
        <th v-if="currentFilter === 'pagos'">Videos Caídos</th>
        <th v-if="currentFilter === 'pagos'">Ganancia Total</th>
        <th v-if="currentFilter === 'pagos'">Ganancia Total menos Impuestos</th>
        <th v-if="currentFilter === 'pagos'">
          Ganancia después de Caídos e Impuestos
        </th>
        <th v-if="currentFilter === 'pagos'">Comisión $</th>
        <th v-if="currentFilter === 'pagos'">Comisión S/.</th>
      </tr>
      </thead>
      <tbody>
      <!-- Filas de Videos y Videos Caídos -->
      <tr
          v-for="(item, index) in filteredData"
          :key="item.id"
          v-if="currentFilter === 'videos' || currentFilter === 'caidos'"
      >
        <td>{{ index + 1 }}</td>
        <td>{{ item.videoId }}</td>
        <td>{{ item.title }}</td>
        <td>{{ item.date }}</td>
        <td>{{ item.views }}</td>
        <td>{{ item.estimatedRevenue }}</td>
        <td>{{ item.averageViewDuration }}</td>
        <td>{{ item.rpm }}</td>
      </tr>

      <!-- Filas de Leyenda de Pagos -->
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
</template>


<script>
import axios from "axios";

export default {
  name: "Reports",
  data() {
    return {
      videos: [],
      caidos: [],
      pagos: [],
      filteredData: [],
      searchQuery: "",
      currentFilter: "videos", // Por defecto se muestran todos los videos
      showFilterMenu: false,
      searchExpanded: false, // Controla la expansión de la barra de búsqueda
    };
  },
  created() {
    this.fetchVideos();
    this.fetchCaidos();
    this.fetchPagos();
  },
  methods: {
    async fetchVideos() {
      try {
        const response = await axios.get("https://api.pa-reporte.com/api/videos");
        this.videos = response.data;
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
        this.caidos = response.data;
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
        this.filteredData = this.pagos;
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
    toggleFilterMenu() {
      this.showFilterMenu = !this.showFilterMenu;
    },
    toggleSearchBar() {
      this.searchExpanded = !this.searchExpanded; // Alterna entre expandir y contraer
      if (!this.searchExpanded) {
        this.searchQuery = ""; // Limpia la búsqueda al contraer
        this.filterData(); // Reinicia los resultados
      }
    },
  },
};
</script>


<style scoped>
.reports-table {
  display: block; /* 🔑 Para que respete el ancho y permita scroll */
  overflow-x: auto; /* 💡 Permite scroll horizontal solo si es necesario */
  white-space: nowrap; /* 🔥 Evita que las celdas se rompan en varias líneas */
}

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

.reports-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  display: block; /* 🔑 Para que respete el ancho y permita scroll */
  overflow-x: auto; /* 💡 Permite scroll horizontal solo si es necesario */
  white-space: nowrap;
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

.thumbnail {
  width: 130px;
  height: auto;
  border-radius: 10px;
}
</style>

