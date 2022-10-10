import { GasTypes } from '@/core/helpers/gasPriceHelper';
import { Node } from '@/utils/networks/nodes/types';
import { Actions } from './actions';
import { Getters } from './getters';

export interface State {
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

export interface This extends State, Actions, Getters {
  [key: string]: any;
}
