<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif; /* Fuente base */
  background-color: #f5f5f5; /* Fondo básico */
}
</style>
