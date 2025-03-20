import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";

// Importa el interceptor para que se ejecute globalmente
import "./services/axios-interceptor"; // Agrega esta línea

const app = createApp(App);

app.use(createPinia()); // Configura Pinia para manejar el estado global
app.use(router); // Configura el router

app.mount("#app");
