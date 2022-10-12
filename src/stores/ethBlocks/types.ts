import { Actions } from './actions';
import { Getters } from './getters';

interface Cart {
  ETH: Array<any>;
  RIN: Array<any>;
}
export interface State {
  localStore: boolean;
  ethBlocksTxs: Array<any>;
  stateVersion: string;
  cart: Cart;
}
export interface This extends State, Actions, Getters {}
