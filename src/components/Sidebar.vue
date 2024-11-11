<template>
  <div class="sidebar">
    <ul>
      <li><a href="#">Inicio</a></li>
      <li><a href="#">Publicaciones</a></li>
      <li><a href="#">Estadísticas</a></li>
      <li><a href="#">Reportes</a></li>
      <li><a href="#">Configuración</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Sidebar",
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #f0f0f0;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  margin: 15px 0;
}

.sidebar a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}
</style>
