import localStore from 'store';
import Configs from './configs';
import { This } from './types';

const INIT_STORE = function (this: This) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.ethBlocksTxs);
    if (savedStore.stateVersion === Configs.VERSION.ethBlocksTxs) {
      Object.assign(this, savedStore);
    }
  }
};

/**
 * Adds blockNumber with a transaction
 * @param {Object} val - {blockNumber: '123', network: 'ETH', hash: '0x...'}
 */
const addEthBlockTx = function (this: This, val: any) {
  if (this.ethBlocksTxs.length >= 100) {
    this.ethBlocksTxs.shift();
  }
  this.ethBlocksTxs.push(val);
};
/**
 * Deletes blockNumber with a transaction from the eth Blocks
 * @param {Object} val - block number
 */
const deleteEthBlockTx = function (this: This, val: any) {
  const idx = this.ethBlocksTxs.findIndex(item => {
    if (item.hash === val.hash) {
      return item;
    }
  });
  if (idx >= 0) {
    this.ethBlocksTxs.splice(idx, 1);
  }
};

/**
 * Adds blockNumber to cart (ETH)
 * @param {string} val
 */
const addBlockToCart = function (this: This, val: string) {
  if (this.cart.ETH.length >= 100) {
    this.cart.ETH.shift();
  }
  this.cart.ETH.push(val);
};

/**
 * Adds blockNumber to cart (RIN)
 * @param {string} val
 */
const addTestBlockToCart = function (this: This, val: string) {
  if (this.cart.RIN.length >= 100) {
    this.cart.RIN.shift();
  }
  this.cart.RIN.push(val);
};

/**
 * remove blockNumber to cart (ETH)
 * @param {string} val
 */
const removeBlockFromCart = function (this: This, val: string) {
  this.cart.ETH = this.cart.ETH.filter(item => {
    if (item !== val) return item;
  });
};

/**
 * remove blockNumber to cart (RIN)
 * @param {string} val
 */
const removeTestBlockFromCart = function (this: This, val: string) {
  this.cart.RIN = this.cart.RIN.filter(item => {
    if (item !== val) return item;
  });
};

/**
 * empty cart
 * @param {string} val
 */
const emptyCart = function (this: This, val: string) {
  if (val === 'RIN') {
    this.cart.RIN = [];
  } else {
    this.cart.ETH = [];
  }
};

export interface Actions {
  INIT_STORE: typeof INIT_STORE;
  addEthBlockTx: typeof addEthBlockTx;
  addTestBlockToCart: typeof addTestBlockToCart;
  deleteEthBlockTx: typeof deleteEthBlockTx;
  addBlockToCart: typeof addBlockToCart;
  removeBlockFromCart: typeof removeBlockFromCart;
  removeTestBlockFromCart: typeof removeTestBlockFromCart;
  emptyCart: typeof emptyCart;
}

export default {
  INIT_STORE,
  addEthBlockTx,
  addTestBlockToCart,
  deleteEthBlockTx,
  addBlockToCart,
  removeBlockFromCart,
  removeTestBlockFromCart,
  emptyCart
};
