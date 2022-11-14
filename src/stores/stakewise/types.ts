import { Store } from 'pinia';
import { Actions } from './actions';
import { Getters } from './getters';

interface StakewiseTxs {
  ETH: Array<any>;
  GOERLI: Array<any>;
}

export type State = {
  localStore: boolean;
  stakewiseTxs: StakewiseTxs;
  validatorApr: string;
  poolSupply: string;
  stakingFee: string;
  stateVersion: string;
  rethBalance: string;
  sethBalance: string;
};

export type ThisStore = Store<'stakewise', State, Getters, Actions>;
