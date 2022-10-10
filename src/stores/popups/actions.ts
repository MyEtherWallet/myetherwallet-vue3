import { This } from './types';
import localStore from 'store';
import Configs from '../configs';

const INIT_STORE = function (this: This) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.popups)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.popups);
    if (savedStore.ThisVersion === Configs.VERSION.popups) {
      Object.assign(this, savedStore);
    }
  }
};

// const setTrackingConsent = function (this: This, val: boolean) {
//   if (this._vm.$matomo) {
//     this._vm.$matomo.setConsentGiven();
//     this._vm.$matomo.trackEvent('consent', val ? 'true' : 'false');
//     if (!val) this._vm.$matomo.forgetConsentGiven();
//   }
//   this.consentToTrack = val;
//   this.setTracking();
// };

// const setTracking = function (this: This) {
//   const matomoExists = (): Promise<void> => {
//     return new Promise(resolve => {
//       const checkInterval = 50;
//       const timeout = 5000;
//       const waitStart = Date.now();
//       const interval = setInterval(() => {
//         if (this._vm.$matomo) {
//           clearInterval(interval);
//           return resolve();
//         }
//         if (Date.now() >= waitStart + timeout) {
//           clearInterval(interval);
//         }
//       }, checkInterval);
//     });
//   };
//   matomoExists().then(() => {
//     if (this.consentToTrack) this._vm.$matomo.setConsentGiven();
//     else this._vm.$matomo.forgetConsentGiven();
//   });
// };

const neverShowEnkryptLandingPage = function (this: This) {
  this.enkryptWalletPopup = false;
  this.enkryptWalletPopupClosed = new Date().getTime();
};

const neverShowEnkryptWalletPage = function (this: This) {
  this.enkryptWalletPopup = false;
  this.enkryptWalletPopupClosed = new Date().getTime();
};

const showEnkryptWalletSnackbar = function (this: This) {
  this.enkryptWalletSnackbar = true;
  this.enkryptWalletSnackbarCounter += 1;
};

const closeEnkryptWalletSnackbar = function (this: This) {
  this.enkryptWalletSnackbar = false;
  this.enkryptWalletSnackbarClosed = new Date().getTime();
};

export interface Actions {
  // setTrackingConsent: typeof setTrackingConsent;
  // setTracking: typeof setTracking;
  neverShowEnkryptLandingPage: typeof neverShowEnkryptLandingPage;
  neverShowEnkryptWalletPage: typeof neverShowEnkryptWalletPage;
  showEnkryptWalletSnackbar: typeof showEnkryptWalletSnackbar;
  closeEnkryptWalletSnackbar: typeof closeEnkryptWalletSnackbar;
  INIT_STORE: typeof INIT_STORE;
}
export default {
  // setTrackingConsent,
  // setTracking,
  neverShowEnkryptLandingPage,
  neverShowEnkryptWalletPage,
  showEnkryptWalletSnackbar,
  closeEnkryptWalletSnackbar,
  INIT_STORE
};
