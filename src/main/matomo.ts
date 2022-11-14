import router from '@/core/router';
export const MatomoOptions = {
  host: 'https://myetherwallet.matomo.cloud',
  siteId: 1,
  trackerFileName: 'matomo',
  router: router,
  enableLinkTracking: true,
  requireConsent: true,
  trackInitialView: true,
  disableCookies: true,
  enableHeartBeatTimer: true,
  heartBeatTimerInterval: 15,
  debug: process.env.NODE_ENV !== 'production'
};
