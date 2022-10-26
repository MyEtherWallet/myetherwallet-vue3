import { PiniaActionAdaptor } from './../types';
import { ThisStore } from './types';
import localStore from 'store';
import Configs from '../configs';

const actions: PiniaActionAdaptor<Actions, ThisStore> = {
  INIT_STORE() {
    if (localStore.get(Configs.LOCAL_STORAGE_KEYS.popups)) {
      const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.popups);
      if (savedStore.ThisVersion === Configs.VERSION.popups) {
        Object.assign(this, savedStore);
      }
    }
  },
  // const setTrackingConsent = function ( val: boolean) {
  //   if (this._vm.$matomo) {
  //     this._vm.$matomo.setConsentGiven();
  //     this._vm.$matomo.trackEvent('consent', val ? 'true' : 'false');
  //     if (!val) this._vm.$matomo.forgetConsentGiven();
  //   }
  //   this.consentToTrack = val;
  //   this.setTracking();
  // };

  // const setTracking = function () {
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
  neverShowEnkryptLandingPage() {
    this.enkryptWalletPopup = false;
    this.enkryptWalletPopupClosed = new Date().getTime();
  },

  neverShowEnkryptWalletPage() {
    this.enkryptWalletPopup = false;
    this.enkryptWalletPopupClosed = new Date().getTime();
  },
  showEnkryptWalletSnackbar() {
    this.enkryptWalletSnackbar = true;
    this.enkryptWalletSnackbarCounter += 1;
  },
  closeEnkryptWalletSnackbar() {
    this.enkryptWalletSnackbar = false;
    this.enkryptWalletSnackbarClosed = new Date().getTime();
  }
};

export type Actions = {
  // setTrackingConsent: (val:boolean) => void;
  // setTracking: () => void;
  neverShowEnkryptLandingPage: () => void;
  neverShowEnkryptWalletPage: () => void;
  showEnkryptWalletSnackbar: () => void;
  closeEnkryptWalletSnackbar: () => void;
  INIT_STORE: () => void;
};

export default actions;
