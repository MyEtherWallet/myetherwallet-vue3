import { PiniaActionAdaptor } from './../types';
import localStore from 'store';
import Configs from './configs';
import { ThisStore } from './types';

const actions: PiniaActionAdaptor<Actions, ThisStore> = {
  INIT_STORE() {
    if (localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise)) {
      const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise);
      if (savedStore.stateVersion === Configs.VERSION.stakewise) {
        Object.assign(this, savedStore);
      }
    }
  },
  addToPendingTxs(tx: any) {
    this.stakewiseTxs.ETH.push(tx);
  },
  addToPendingTxsGoerli(tx: any) {
    this.stakewiseTxs.GOERLI.push(tx);
  },
  removePendingTxs(tx: any) {
    this.stakewiseTxs.ETH = this.stakewiseTxs.ETH.filter((item: any) => {
      return item.hash !== tx;
    });
  },
  removePendingTxsGoerli(tx: any) {
    this.stakewiseTxs.GOERLI = this.stakewiseTxs.GOERLI.filter((item: any) => {
      return item.hash !== tx;
    });
  }
};

export type Actions = {
  INIT_STORE: () => void;
  addToPendingTxs: (tx: any) => void;
  addToPendingTxsGoerli: (tx: any) => void;
  removePendingTxs: (tx: any) => any;
  removePendingTxsGoerli: (tx: any) => any;
};

export default actions;
