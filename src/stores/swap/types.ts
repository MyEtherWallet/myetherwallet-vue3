import { Store } from 'pinia';
import { Actions } from './actions';

export type State = {
  localStore: boolean;
  prefetched: boolean;
  swapTokens: Array<any>;
};

export type ThisStore = Store<'swap', State, Actions>;
