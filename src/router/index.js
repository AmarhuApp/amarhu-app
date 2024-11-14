// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import LastVideoPerformance from '@/components/sections/LastVideoPerformance.vue';
import Statistics from '@/views/Statistics.vue';
import Posts from '@/views/Posts.vue';
import Reports from '@/views/Reports.vue';
import Settings from '@/views/Settings.vue';

const routes = [
    {
        path: '/',
        component: Home,
        children: [
            {
                path: '',
                name: 'Home',
                component: LastVideoPerformance,
            },
            {
                path: 'statistics',
                name: 'Statistics',
                component: Statistics,
            },
            {
                path: 'posts',
                name: 'Posts',
                component: Posts,
            },
            {
                path: 'reports',
                name: 'Reports',
                component: Reports,
            },
            {
                path: 'settings',
                name: 'Settings',
                component: Settings,
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
