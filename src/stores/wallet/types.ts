import Web3 from 'web3/types';
import { Actions } from './actions';
import { Getters } from './getters';

export interface State {
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
  web3: Web3 | any |null;
  ensDomains: Array<any> | null;
  tokens: Array<any>;
  loadingWalletInfo: boolean;
}

export interface This extends State, Actions, Getters {}
