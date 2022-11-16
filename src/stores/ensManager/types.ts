import { Store } from 'pinia';
import { Actions } from './actions';

export interface State {
  localStore: boolean;
  showHasClaimable: boolean;
  stateVersion: string;
}

export type ThisStore = Store<'ensManager', State, any, Actions>;
