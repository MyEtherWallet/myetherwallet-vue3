/**
 * Matomo Analytics Mixin
 */
import { usePopupStore } from '@/stores/popups';
import { useWalletStore } from '@/stores/wallet';
//import categories from './configs/configCategories';

export const useAnalytics = () => {
  const walletStore = useWalletStore();
  const popupStore = usePopupStore();
  const shouldDisplayTrackingPopup = () => {
    if (walletStore.isOfflineApp) return false;
    if (!popupStore.enkryptLandingPopup) {
      return popupStore.displayedTrackingPopup;
    }
    return true;
  };
  /**
   * Sets the consent to track on wallet page
   */
  const setConsent = () => {
    popupStore.consentToTrack = !popupStore.consentToTrack;
  };
  /**
   * Tracks when user lands on landing page
   */
  const trackLandingPage = () => {
    //  if (this.$matomo && popupStore.consentToTrack) {
    //    this.$matomo.trackEvent(categories.landingPage, 'landed on');
    //  }
  };
  /**
   * Tracks when user lands on create wallet
   * also tracks what type of wallet user creates
   * (depends on the action being passed in)
   */
  const trackCreateWallet = (action: any) => {
    // if (this.$matomo && action && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.createWallet, action);
    // }
  };
  /**
   * Tracks when user lands on access wallet
   * also tracks what type of connection user uses to access dashboard
   * (depends on the action being passed in)
   */
  const trackAccessWallet = (action: any) => {
    // if (this.$matomo && action && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.accessWallet, action);
    // }
  };
  /**
   * Tracks when user switches network
   */
  const trackNetworkSwitch = (action: any) => {
    // if (this.$matomo && action && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.networkSwitch, action);
    // }
  };
  /**
   * Tracks which dapp user navigates to
   */
  const trackDapp = (action: any) => {
    // if (this.$matomo && action && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.dapp, action);
    // }
  };
  /**
   * Tracks when user changes gas type
   */
  const trackGasSwitch = (action: any) => {
    // if (this.$matomo && action && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.gasSwitch, action);
    // }
  };
  /**
   * Tracks when global error modal pops up
   */
  const trackGlobalError = (action: any) => {
    // if (this.$matomo && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.globalError, action);
    // }
  };
  /**
   * Tracks when user logs out of dashboard
   */
  const trackLogout = () => {
    // if (this.$matomo && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.exitDashboard, 'true');
    // }
  };
  /**
   * Tracks when user clicks enkrypt install
   */
  const trackEnkryptInstall = () => {
    // if (this.$matomo && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.enkrypt, 'true');
    // }
  };
  /**
   * Tracks when user clicks mewwallet install
   */
  const trackMewWalletInstall = () => {
    // if (this.$matomo && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.mewwallet, 'true');
    // }
  };
  /**
   * SWAP specific analytics
   */

  /**
   * Tracks which swap rate user clicks
   */
  const trackSwapRate = (action: any) => {
    // if (this.$matomo && action && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.swapTokenPair, action);
    // }
  };
  /**
   * Tracks which swap rate user clicks
   */
  const trackSwapToken = (action: any) => {
    // if (this.$matomo && action && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.swapToken, action);
    // }
  };
  /**
   * Tracks what user selects to swap from
   * and swap to
   */
  const trackSwap = (action: any) => {
    // if (this.$matomo && action && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.swap, action);
    // }
  };
  /**
   * Tracks what user selects to buy or sell
   */
  const trackBuySell = (action: any) => {
    // if (this.$matomo && action && popupStore.consentToTrack) {
    //   this.$matomo.trackEvent(categories.buySell, action);
    // }
  };
  return {
    shouldDisplayTrackingPopup,
    setConsent,
    trackLandingPage,
    trackCreateWallet,
    trackAccessWallet,
    trackNetworkSwitch,
    trackDapp,
    trackGasSwitch,
    trackLogout,
    trackGlobalError,
    trackEnkryptInstall,
    trackMewWalletInstall,
    trackSwap,
    trackSwapRate,
    trackSwapToken,
    trackBuySell
  };
};
