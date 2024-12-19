import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import LastVideoPerformance from "@/components/sections/LastVideoPerformance.vue";
import Posts from "@/views/Posts.vue";
import Statistics from "@/views/Statistics.vue";
import Reports from "@/views/Reports.vue";
import Settings from "@/views/Settings.vue";
import UserProfile from "@/views/UserProfile.vue";

const routes = [
    {
        path: "/",
        component: Home,
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
        component: UserProfile, // Nueva ruta para el perfil de usuario
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
