import Configs from './configs';
import { State } from './types';

const ethBlocksTxs = (): State => ({
  localStore: true,
  ethBlocksTxs: [],
  stateVersion: Configs.VERSION.ethBlocksTxs,
  cart: {
    ETH: [],
    RIN: []
  }
});

export default ethBlocksTxs;
