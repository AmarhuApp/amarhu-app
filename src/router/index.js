import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import LastVideoPerformance from "@/components/sections/LastVideoPerformance.vue";
import Posts from "@/views/Posts.vue";
import Statistics from "@/views/Statistics.vue";
import Reports from "@/views/Reports.vue";
import Settings from "@/views/Settings.vue";
import UserProfile from "@/views/UserProfile.vue";
import Login from "@/views/Login.vue";

const routes = [
    {
        path: "/login",
        name: "Login",
        component: Login, // Nueva ruta para el inicio de sesión
    },
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: { requiresAuth: true }, // Protección de ruta
        children: [
            {
                path: "",
                name: "LastVideoPerformance",
                component: LastVideoPerformance,
            },
            {
                path: "posts",
                name: "Posts",
                component: Posts,
            },
            {
                path: "statistics",
                name: "Statistics",
                component: Statistics,
            },
            {
                path: "reports",
                name: "Reports",
                component: Reports,
            },
            {
                path: "settings",
                name: "Settings",
                component: Settings,
            },
        ],
    },
    {
        path: "/user-profile",
        name: "UserProfile",
        component: UserProfile, // Ruta para el perfil de usuario
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Protección de rutas
router.beforeEach((to, from, next) => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");

    if (to.meta.requiresAuth) {
        if (!isLoggedIn || !userId) {
            // Redirige al login si no hay sesión
            next({ name: "Login" });
        } else {
            next(); // Permite la navegación
        }
    } else {
        next(); // Permite el acceso a rutas públicas
    }
});

export default router;
