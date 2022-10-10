import { Actions } from './actions';

export type State = {
  localStore: boolean;
  prefetched: boolean;
  swapTokens: Array<any>;
};

export interface This extends State, Actions {}
