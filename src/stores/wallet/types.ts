import { Store } from 'pinia';
import Web3 from 'web3/types';
import { Actions } from './actions';
import { Getters } from './getters';

export type State = {
  localStore: boolean;
  address: string | null;
  balance: string;
  blockNumber: number;
  identifier: string;
  nickname: string;
  isHardware: boolean;
  ledgerBLE: boolean;
  instance: any | null;
  isOfflineApp: boolean;
  web3: Web3 | any | null;
  ensDomains: Array<any> | null;
  tokens: Array<any>;
  loadingWalletInfo: boolean;
};

export type ThisStore = Store<'wallet', State, Getters, Actions>;
