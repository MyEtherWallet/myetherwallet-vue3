import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import routesDefault from './routes-default';
import routesNotFound from './routes-not-found';
import routesWallet from './routes-wallet';

const routes: Array<RouteRecordRaw> = [
  routesDefault,
  routesWallet,
  routesNotFound
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
