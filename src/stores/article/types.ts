import { Store } from 'pinia';
import { Actions } from './actions';

export interface State {
  localStore: boolean;
  articleStore: { [key: string]: string };
  timestamp: number;
  stateVersion: string;
}

export type ThisStore = Store<'article', State, any, Actions>;
