import { useSwapStore } from './../swap/index';
import matchNetwork from '@/core/helpers/matchNetwork';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
import { useWalletStore } from '../wallet';
import { This } from './types';
import BN from 'bn.js';

const setOnlineStatus = function (this: This, status: boolean) {
  const walletStore = useWalletStore();
  if (status) walletStore.setWeb3Instance(null);
  this.online = status;
};

const updateGasPrice = function (this: This) {
  const walletStore = useWalletStore();
  const { gasPriceMultiplier } = this.network().type;
  if (!this.isEIP1559SupportedNetwork()) {
    return walletStore.web3.eth.getGasPrice().then((res: any) => {
      const modifiedGasPrice = toBNSafe(res).muln(gasPriceMultiplier || 1);
      return this.setGasPrice(modifiedGasPrice.toString());
    });
  }
  return walletStore.web3.eth.getGasPrice().then((gasPrice: any) => {
    const modGas = toBNSafe(gasPrice).muln(gasPriceMultiplier || 1);
    const priorityFee = modGas.sub(toBNSafe(this.eip1559.baseFeePerGas));
    return this.setMaxPriorityFeePerGas(priorityFee);
  });
};
interface NetworkParam {
  network?: any;
  walletType: string;
}
const setNetwork = async function (
  this: This,
  { network, walletType }: NetworkParam
) {
  const chainID = network?.type?.chainID;
  const matched = await matchNetwork(chainID, walletType);
  if (matched) {
    const _netObj = Object.assign({}, network);
    _netObj.type = {
      name: network.type.name
    };
    this.currentNetwork = _netObj;
  }
  const swapStore = useSwapStore();
  swapStore.resetPrefetch();
};
const addLocalContract = function (this: This, localContract: any) {
  if (!this.localContracts[this.currentNetwork.type.name])
    this.localContracts[this.currentNetwork.type.name] = [];
  this.localContracts[this.currentNetwork.type.name].push(localContract);
};
const setImportedState = function (this: This, stateObj: any) {
  stateObj['localStore'] = true;
  Object.keys(stateObj).forEach(item => {
    this[item] = stateObj[item];
  });
};
const setMaxPriorityFeePerGas = function (this: This, val: BN) {
  this.eip1559.maxPriorityFeePerGas = val.toString();
};

const setBaseFeePerGas = function (this: This, val: BN) {
  this.eip1559.baseFeePerGas = val.toString();
};

export interface Actions {
  updateGasPrice: typeof updateGasPrice;
  setOnlineStatus: typeof setOnlineStatus;
  setNetwork: typeof setNetwork;
  setImportedState: typeof setImportedState;
  addLocalContract: typeof addLocalContract;
  setMaxPriorityFeePerGas: typeof setMaxPriorityFeePerGas;
  setBaseFeePerGas: typeof setBaseFeePerGas;
}
export default {
  updateGasPrice,
  setOnlineStatus,
  setNetwork,
  setImportedState,
  addLocalContract,
  setMaxPriorityFeePerGas,
  setBaseFeePerGas
};
