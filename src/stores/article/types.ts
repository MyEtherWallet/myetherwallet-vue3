import { Actions } from './actions';

export interface State {
  localStore: boolean;
  articleStore: { [key: string]: string };
  timestamp: number;
  stateVersion: string;
}

export interface This extends State, Actions {}
