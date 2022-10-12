import { Actions } from './actions';
import { Getters } from './getters';

interface StakewiseTxs {
  ETH: Array<any>;
  GOERLI: Array<any>;
}
export interface State {
  localStore: Boolean;
  stakewiseTxs: StakewiseTxs;
  validatorApr: string;
  poolSupply: string;
  stakingFee: string;
  stateVersion: string;
  rethBalance: string;
  sethBalance: string;
}

export interface This extends State, Actions, Getters {}
