import { ROUTES_HOME } from '../configs/configRoutes';

export default {
  path: ROUTES_HOME.PAGE_NOT_FOUND.PATH,
  component: () => import('@/views/TheDefaultView.vue'),
  children: [
    {
      path: ROUTES_HOME.PAGE_NOT_FOUND.PATH,
      name: ROUTES_HOME.PAGE_NOT_FOUND.NAME,
      component: () =>
        import('@/views/layouts-default/ThePageNotFoundLayout.vue'),
      meta: {
        noAuth: true
      }
    }
  ]
};
