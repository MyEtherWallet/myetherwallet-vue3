import { useGlobalStore } from '../global';
import { PiniaGetterAdaptor } from '../types';
import { ThisStore } from './types';

const getters: PiniaGetterAdaptor<Getters, ThisStore> = {
  /**
   * Returns all transactions in the state
   * @returns {Array}
   */
  getAllEthBlocksTxs() {
    const currentNetworkType = useGlobalStore().network;
    const filteredArray = this.ethBlocksTxs.filter((item: any) => {
      if (item.network === currentNetworkType) return item;
    });
    return this.ethBlocksTxs.length > 0 ? filteredArray : [];
  },

  /**
   * Returns all transactions in the state
   * @param {Object} block - {blockNumber: '1234', hash: '0x...', network: 'Eth' }
   * @returns {Object} --> {blockNumber: '1234', hash: '0x...', network: 'Eth' }
   */
  getEthBlockTx() {
    return () => (block: any) => {
      const filteredArray = this.ethBlocksTxs.filter((item: any) => {
        if (
          block.blockNumber === item.blockNumber &&
          item.network === block.network
        ) {
          return item;
        }
      });
      return filteredArray.length > 0 ? filteredArray[0] : null;
    };
  }
};

export type Getters = {
  getAllEthBlocksTxs: any;
  getEthBlockTx: () => (block: any) => any;
};
export default getters;
