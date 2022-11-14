import { RouteRecordRaw } from 'vue-router';
import { ROUTES_HOME } from '../configs/configRoutes';
import {
  createWalletProps,
  createRouteGuard,
  accessWalletProps,
  accessRouteGuard
} from './helpers';

export default <RouteRecordRaw>{
  path: '/',
  component: () => import('@/views/TheDefaultView.vue'),
  props: true,
  children: [
    {
      path: ROUTES_HOME.HOME.PATH,
      name: ROUTES_HOME.HOME.NAME,
      component: () => import('@/views/layouts-default/TheHomeLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.HOW_IT_WORKS.PATH,
      name: ROUTES_HOME.HOW_IT_WORKS.NAME,
      component: () =>
        import('@/views/layouts-default/TheHowItWorksLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.SECURITY_POLICY.PATH,
      name: ROUTES_HOME.SECURITY_POLICY.NAME,
      component: () =>
        import('@/views/layouts-default/TheSecurityPolicyLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.PRIVACY_POLICY.PATH,
      name: ROUTES_HOME.PRIVACY_POLICY.NAME,
      component: () =>
        import('@/views/layouts-default/ThePrivacyPolicyLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TERMS_OF_SERVICE.PATH,
      name: ROUTES_HOME.TERMS_OF_SERVICE.NAME,
      component: () =>
        import('@/views/layouts-default/TheTermsOfServiceLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TOOLS.PATH,
      name: ROUTES_HOME.TOOLS.NAME,
      component: () => import('@/views/layouts-default/TheToolsLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.BUY_HARDWARE_WALLET.PATH,
      name: ROUTES_HOME.BUY_HARDWARE_WALLET.NAME,
      component: () =>
        import('@/views/layouts-default/TheBuyHardwareWalletLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.ABOUT_PAGE.PATH,
      name: ROUTES_HOME.ABOUT_PAGE.NAME,
      component: () => import('@/views/layouts-default/TheCompanyLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.TEAM_PAGE.PATH,
      name: ROUTES_HOME.TEAM_PAGE.NAME,
      component: () => import('@/views/layouts-default/TheTeamLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.PRESS_KIT.PATH,
      name: ROUTES_HOME.PRESS_KIT.NAME,
      component: () => import('@/views/layouts-default/ThePressKitLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.DAPP_SUBMISSION.PATH,
      name: ROUTES_HOME.DAPP_SUBMISSION.NAME,
      component: () =>
        import('@/views/layouts-default/TheDappSubmissionLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.CONVERT_UNITS.PATH,
      name: ROUTES_HOME.CONVERT_UNITS.NAME,
      component: () =>
        import('@/views/layouts-default/TheConvertUnitsLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.JOBS.PATH,
      name: ROUTES_HOME.JOBS.NAME,
      component: () => import('@/views/layouts-default/TheCareersLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.QR_CODE.PATH,
      name: ROUTES_HOME.QR_CODE.NAME,
      component: () => import('@/views/layouts-default/TheQrCodeLayout.vue'),
      meta: {
        noAuth: true
      }
    },
    {
      path: ROUTES_HOME.CREATE_WALLET.PATH,
      name: ROUTES_HOME.CREATE_WALLET.NAME,
      component: () =>
        import('@/views/layouts-default/TheCreateWalletLayout.vue'),
      props: createWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: createRouteGuard
    },
    {
      path: ROUTES_HOME.ACCESS_WALLET.PATH,
      name: ROUTES_HOME.ACCESS_WALLET.NAME,
      component: () =>
        import('@/views/layouts-default/TheAccessWalletLayout.vue'),
      props: accessWalletProps,
      meta: {
        noAuth: true
      },
      beforeEnter: accessRouteGuard
    }
  ]
};
