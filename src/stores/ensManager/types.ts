import { Actions } from './actions';

export interface State {
  localStore: boolean;
  showHasClaimable: boolean;
  stateVersion: string;
}

export interface This extends State, Actions {}
