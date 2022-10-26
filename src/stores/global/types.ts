import { GasTypes } from '@/core/helpers/gasPriceHelper';
import { Node } from '@/utils/networks/nodes/types';
import { Store } from 'pinia';
import { Actions } from './actions';
import { Getters } from './getters';

export interface State {
  [key: string]: any;
  localStore: boolean;
  Errors: any;
  online: boolean;
  linkQuery: any;
  locale: 'en_US' | 'ru_RU';
  stateVersion: string;
  gasLimitWarning: number;
  baseGasPrice: string;
  gasPriceType: GasTypes;
  currentNetwork: Node;
  validNetwork: boolean;
  preferredCurrency: string;
  localContracts: any;
  eip1559: {
    baseFeePerGas: string;
    maxPriorityFeePerGas: string;
  };
  testing: boolean;
}

export type ThisStore = Store<'global', State, Getters, Actions>;
