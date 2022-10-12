import { Actions } from './actions';
import { Getters } from './getters';

export interface State {
  localStore: boolean;
  tokens: { [key: string]: Array<any> };
  paths: Array<any>;
  stateVersion: string;
  addressBook: Array<string>;
  hiddenTokens: { [key: string]: any };
}

export interface This extends State, Actions, Getters {}
