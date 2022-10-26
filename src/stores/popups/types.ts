import { Store } from 'pinia';
import { Actions } from './actions';

export interface State {
  localStore: boolean;
  stateVersion: string;
  consentToTrack: boolean;
  displayedTrackingPopup: boolean;
  showedBanner: boolean;
  showWalletPromo: boolean;
  showEnkryptPromo: boolean;
  promoOver: boolean;
  enkryptLandingPopup: boolean;
  enkryptLandingPopupClosed: number;
  enkryptWalletPopup: boolean;
  enkryptWalletPopupClosed: number;
  enkryptWalletSnackbar: boolean;
  enkryptWalletSnackbarClosed: number;
  enkryptWalletSnackbarCounter: number;
}

export type ThisStore = Store<'popups', State, Actions>;
