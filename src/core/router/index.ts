import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import routesDefault from './routes-default';

const routes: Array<RouteRecordRaw> = [routesDefault];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
