import { Actions } from './actions';
import { Getters } from './getters';

export interface State {
  localStore: boolean;
  notifications: Array<any>;
  stateVersion: string;
}

export interface This extends State, Actions, Getters {}
