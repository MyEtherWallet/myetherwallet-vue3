import { Store } from 'pinia';
import { Actions } from './actions';
import { Getters } from './getters';

export type State = {
  localStore: boolean;
  notifications: Array<any>;
  stateVersion: string;
};

export type ThisStore = Store<'notifications', State, Getters, Actions>;
