import { useGlobalStore } from '../global';
import { This } from './types';

/**
 * Returns all transactions in the state
 * @returns {Array}
 */
const getAllEthBlocksTxs = function (this: This) {
  const currentNetworkType = useGlobalStore().network;
  const filteredArray = this.ethBlocksTxs.filter(item => {
    if (item.network === currentNetworkType) return item;
  });
  return this.ethBlocksTxs.length > 0 ? filteredArray : [];
};

/**
 * Returns all transactions in the state
 * @param {Object} block - {blockNumber: '1234', hash: '0x...', network: 'Eth' }
 * @returns {Object} --> {blockNumber: '1234', hash: '0x...', network: 'Eth' }
 */
const getEthBlockTx = function (this: This) {
  return (block: any) => {
    const filteredArray = this.ethBlocksTxs.filter(item => {
      if (
        block.blockNumber === item.blockNumber &&
        item.network === block.network
      ) {
        return item;
      }
    });
    return filteredArray.length > 0 ? filteredArray[0] : null;
  };
};
export interface Getters {
  getAllEthBlocksTxs: typeof getAllEthBlocksTxs;
  getEthBlockTx: typeof getEthBlockTx;
}
export default { getAllEthBlocksTxs, getEthBlockTx };
