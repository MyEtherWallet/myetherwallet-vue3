import localStore from 'store';
import { PiniaActionAdaptor } from '../types';
import Configs from './configs';
import { ThisStore } from './types';

const actions: PiniaActionAdaptor<Actions, ThisStore> = {
  INIT_STORE() {
    if (localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs)) {
      const savedStore = localStore.get(
        Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs
      );
      if (savedStore.stateVersion === Configs.VERSION.ethBlocksTxs) {
        Object.assign(this, savedStore);
      }
    }
  },

  /**
   * Adds blockNumber with a transaction
   * @param {Object} val - {blockNumber: '123', network: 'ETH', hash: '0x...'}
   */
  addEthBlockTx(val: any) {
    if (this.ethBlocksTxs.length >= 100) {
      this.ethBlocksTxs.shift();
    }
    this.ethBlocksTxs.push(val);
  },
  /**
   * Deletes blockNumber with a transaction from the eth Blocks
   * @param {Object} val - block number
   */
  deleteEthBlockTx(val: any) {
    const idx = this.ethBlocksTxs.findIndex((item: any) => {
      if (item.hash === val.hash) {
        return item;
      }
    });
    if (idx >= 0) {
      this.ethBlocksTxs.splice(idx, 1);
    }
  },

  /**
   * Adds blockNumber to cart (ETH)
   * @param {string} val
   */
  addBlockToCart(val: string) {
    if (this.cart.ETH.length >= 100) {
      this.cart.ETH.shift();
    }
    this.cart.ETH.push(val);
  },

  /**
   * Adds blockNumber to cart (RIN)
   * @param {string} val
   */
  addTestBlockToCart(val: string) {
    if (this.cart.RIN.length >= 100) {
      this.cart.RIN.shift();
    }
    this.cart.RIN.push(val);
  },

  /**
   * remove blockNumber to cart (ETH)
   * @param {string} val
   */
  removeBlockFromCart(val: string) {
    this.cart.ETH = this.cart.ETH.filter((item: any) => {
      if (item !== val) return item;
    });
  },

  /**
   * remove blockNumber to cart (RIN)
   * @param {string} val
   */
  removeTestBlockFromCart(val: string) {
    this.cart.RIN = this.cart.RIN.filter((item: any) => {
      if (item !== val) return item;
    });
  },

  /**
   * empty cart
   * @param {string} val
   */
  emptyCart(val: string) {
    if (val === 'RIN') {
      this.cart.RIN = [];
    } else {
      this.cart.ETH = [];
    }
  }
};

export type Actions = {
  INIT_STORE: () => void;
  addEthBlockTx: (val: any) => void;
  addTestBlockToCart: (val: string) => void;
  deleteEthBlockTx: (val: any) => void;
  addBlockToCart: (val: string) => void;
  removeBlockFromCart: (val: string) => void;
  removeTestBlockFromCart: (val: string) => void;
  emptyCart: (val: string) => void;
};

export default actions;
