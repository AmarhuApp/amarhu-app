// src/main.js
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";
import "./services/axios-interceptor";

import { useUserStore } from "@/store/user";

const app = createApp(App);
app.use(createPinia());
app.use(router);

const store = useUserStore();

// ✅ Espera la restauración antes de montar
store.initializeSession().finally(() => {
    app.mount("#app");

});
