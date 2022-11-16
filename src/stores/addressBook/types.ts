import { Store } from 'pinia';
import { Actions } from './actions';

export interface State {
  localStore: boolean;
  addressBookStore: Array<string>;
  isMigrated: boolean;
  stateVersion: string;
}

export type ThisStore = Store<'addressBook', State, any, Actions>;
