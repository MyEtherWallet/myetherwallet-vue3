import { Actions } from './actions';
import { Getters } from './getters';

export type State = {
  localStore: boolean;
  path: string;
  currencyRate: any;
  coinGeckoTokens: Map<any, any>; //map of {coingeckoId: coingeckotokeninfo}
  networkTokens: Map<any, any>; //map of {contract: token}
};

export interface This extends State, Actions, Getters {}
