import localStore from 'store';
import Configs from './configs';
import { This } from './types';

const INIT_STORE = function (this: This) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise);
    if (savedStore.stateVersion === Configs.VERSION.stakewise) {
      Object.assign(this, savedStore);
    }
  }
};

const addToPendingTxs = function (this: This, tx: any) {
  this.stakewiseTxs.ETH.push(tx);
};
const addToPendingTxsGoerli = function (this: This, tx: any) {
  this.stakewiseTxs.GOERLI.push(tx);
};
const removePendingTxs = function (this: This, tx: any) {
  this.stakewiseTxs.ETH = this.stakewiseTxs.ETH.filter((item: any) => {
    return item.hash !== tx;
  });
};
const removePendingTxsGoerli = function (this: This, tx: any) {
  this.stakewiseTxs.GOERLI = this.stakewiseTxs.GOERLI.filter((item: any) => {
    return item.hash !== tx;
  });
};
export interface Actions {
  INIT_STORE: typeof INIT_STORE;
  addToPendingTxs: typeof addToPendingTxs;
  addToPendingTxsGoerli: typeof addToPendingTxsGoerli;
  removePendingTxs: typeof removePendingTxs;
  removePendingTxsGoerli: typeof removePendingTxsGoerli;
}
export default {
  INIT_STORE,
  addToPendingTxs,
  addToPendingTxsGoerli,
  removePendingTxs,
  removePendingTxsGoerli
};
