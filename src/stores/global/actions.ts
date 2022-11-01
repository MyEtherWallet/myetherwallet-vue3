import localStore from 'store';
import Configs from '../configs';
import { useSwapStore } from './../swap/index';
import matchNetwork from '@/core/helpers/matchNetwork';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
import { useWalletStore } from '../wallet';
import { ThisStore } from './types';
import nodeList from '@/utils/networks';
import BN from 'bn.js';
import { PiniaActionAdaptor } from '../types';
const defaultNetwork = nodeList['ETH'].find(item => {
  return item.service === 'myetherwallet.com-ws';
});

const actions: PiniaActionAdaptor<Actions, ThisStore> = {
  INIT_STORE() {
    if (localStore.get(Configs.LOCAL_STORAGE_KEYS.global)) {
      const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.global);
      if (savedStore.stateVersion === Configs.VERSION.global) {
        if (!nodeList[savedStore.currentNetwork.type.name]) {
          savedStore['currentNetwork'] = defaultNetwork;
          savedStore.currentNetwork.type = {
            name: 'ETH'
          };
        }
        Object.assign(this, savedStore);
      }
    }
  },
  setOnlineStatus(status: boolean) {
    const walletStore = useWalletStore();
    if (status) walletStore.setWeb3Instance('');
    this.online = status;
  },
  updateGasPrice() {
    const walletStore = useWalletStore();
    const { gasPriceMultiplier } = this.network.type;
    if (!this.isEIP1559SupportedNetwork) {
      return walletStore.web3.eth.getGasPrice().then((res: any) => {
        const modifiedGasPrice = toBNSafe(res).muln(gasPriceMultiplier || 1);
        return (this.baseGasPrice = modifiedGasPrice.toString());
      });
    }
    return walletStore.web3.eth.getGasPrice().then((gasPrice: any) => {
      const modGas = toBNSafe(gasPrice).muln(gasPriceMultiplier || 1);
      const priorityFee = modGas.sub(toBNSafe(this.eip1559.baseFeePerGas));
      return this.setMaxPriorityFeePerGas(priorityFee);
    });
  },

  setNetwork: async function ({ network, walletType }: NetworkParam) {
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
    swapStore.prefetched = false;
  },
  addLocalContract(localContract: any) {
    if (!this.localContracts[this.currentNetwork.type.name])
      this.localContracts[this.currentNetwork.type.name] = [];
    this.localContracts[this.currentNetwork.type.name].push(localContract);
  },
  setImportedState(stateObj: any) {
    stateObj['localStore'] = true;
    Object.keys(stateObj).forEach(item => {
      this[item] = stateObj[item];
    });
  },
  setMaxPriorityFeePerGas(val: BN) {
    this.eip1559.maxPriorityFeePerGas = val.toString();
  },

  setBaseFeePerGas(val: BN) {
    this.eip1559.baseFeePerGas = val.toString();
  }
};
interface NetworkParam {
  network?: any;
  walletType: string;
}
export type Actions = {
  INIT_STORE: () => void;
  updateGasPrice: () => any;
  setOnlineStatus: (status: boolean) => void;
  setNetwork: (obj: NetworkParam) => any;
  setImportedState: (stateObj: any) => void;
  addLocalContract: (localContract: any) => void;
  setMaxPriorityFeePerGas: (val: BN) => void;
  setBaseFeePerGas: (val: BN) => void;
};
export default actions;
