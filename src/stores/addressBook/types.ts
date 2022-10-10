import { Actions } from './actions';

export interface State {
  localStore: boolean;
  addressBookStore: Array<string>;
  isMigrated: boolean;
  stateVersion: string;
}

export interface This extends State, Actions {}
