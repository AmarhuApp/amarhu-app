import { createRouter, createWebHistory } from "vue-router";
import { waitForAuth } from "@/utils/authReady"; // 👈 esperar sesión
import { safeSession } from "@/utils/safeSession"; // 👈 acceder al storage de forma segura

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
        component: Login,
    },
    {
        path: "/",
        name: "Home",
        component: Home,
        meta: { requiresAuth: true },
        children: [
            { path: "", name: "LastVideoPerformance", component: LastVideoPerformance },
            { path: "posts", name: "Posts", component: Posts },
            { path: "statistics", name: "Statistics", component: Statistics },
            { path: "reports", name: "Reports", component: Reports },
            { path: "settings", name: "Settings", component: Settings },
        ],
    },
    {
        path: "/user-profile",
        name: "UserProfile",
        component: UserProfile,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 🔒 Protección de rutas con espera de sesión
router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth) {
        await waitForAuth(); // ⏳ espera a que esté lista la sesión
        const isLoggedIn = safeSession.get("isLoggedIn");
        const userId = safeSession.get("userId");

        if (!isLoggedIn || !userId) {
            return next({ name: "Login" });
        }
    }
    return next();
});

export default router;
