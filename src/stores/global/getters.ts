import { PiniaGetterAdaptor } from './../types';
import { GasTypes } from './../../core/helpers/gasPriceHelper';
import nodeList, { Nodes } from '@/utils/networks';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import {
  getGasBasedOnType,
  getPriorityFeeBasedOnType,
  getBaseFeeBasedOnType,
  gasPriceTypes
} from '@/core/helpers/gasPriceHelper';
import { toBN } from 'web3-utils';
import { isEmpty } from 'lodash';
import { formatFiatValue } from '@/core/helpers/numberFormatHelper';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { ThisStore } from './types';
import BigNumber from 'bignumber.js';
import { useExternalStore } from '../external';
import { useWalletStore } from '../wallet';
import { Node } from '@/utils/networks/nodes/types';
import BN from 'bn.js';
const getters: PiniaGetterAdaptor<Getters, ThisStore> = {
  Networks() {
    return nodeList;
  },
  network() {
    let network = nodeList['ETH'][0];
    if (!nodeList[this.currentNetwork.type.name]) {
      throw new Error('Current network is not in nodeList.');
    }
    const iteratableArr = nodeList[this.currentNetwork.type.name];
    network = Object.assign({}, this.currentNetwork);
    network.type = !isEmpty(nodeList[this.currentNetwork.type.name])
      ? nodeList[this.currentNetwork.type.name][0].type
      : ETH;
    for (let index = 0; index < iteratableArr.length; index++) {
      if (this.currentNetwork.service === iteratableArr[index].service) {
        network = iteratableArr[index];
        this.gasPriceByType('economy');
        break;
      }
    }
    return network;
  },
  gasPriceByType: state => () => (type: GasTypes) => {
    if (!state.isEIP1559SupportedNetwork) {
      return getGasBasedOnType(state.baseGasPrice, type);
    }
    const priorityFee = getPriorityFeeBasedOnType(
      toBN(state.eip1559.maxPriorityFeePerGas),
      type
    );
    const baseFee = getBaseFeeBasedOnType(
      toBN(state.eip1559.baseFeePerGas),
      type
    );
    return baseFee.add(priorityFee).toString();
  },
  gasPrice() {
    if (!this.isEIP1559SupportedNetwork) {
      return getGasBasedOnType(this.baseGasPrice, this.gasPriceType);
    }
    return this.gasFeeMarketInfo.maxFeePerGas.toString();
  },
  isEthNetwork() {
    return this.network.type.name === ETH.name;
  },
  isTestNetwork() {
    return this.network.type.isTestNetwork;
  },
  getLocalContracts(): Array<any> | any {
    return this.localContracts[this.network.type.name]
      ? this.localContracts[this.network.type.name]
      : [];
  },
  hasSwap() {
    const { instance } = useWalletStore();
    const name = this.network.type.name;
    const device = instance.identifier;

    if (device === WALLET_TYPES.COOL_WALLET_S) return false;
    return name === ETH.name || name === BSC.name || name === MATIC.name;
  },
  swapLink() {
    const { address } = useWalletStore();
    const hasAddress = address;
    const link = 'https://ccswap.myetherwallet.com/#/';
    return hasAddress ? `${link}?to=${hasAddress}` : link;
  },
  currencyConfig() {
    const currency = this.preferredCurrency;
    const externalStore = useExternalStore();
    const rate = externalStore.currencyRate.data
      ? externalStore.currencyRate.data.exchange_rate
      : 1;
    return { currency, rate };
  },
  /**
   * @param {Number|String} value
   * @param {Object} options
   * @param {Boolean} options.doNotLocalize - formats value to currency, no rate
   * @returns - Formatted localized currency
   */
  getFiatValue() {
    return () =>
      (value: string | number | BigNumber, options: FiatValueOptions = {}) => {
        const config: any = options.doNotLocalize
          ? { currency: this.currencyConfig.currency }
          : this.currencyConfig;
        return formatFiatValue(value, config).value;
      };
  },

  isEIP1559SupportedNetwork() {
    return this.eip1559.baseFeePerGas !== '0';
  },
  gasFeeMarketInfo() {
    const priorityFee = getPriorityFeeBasedOnType(
        toBN(this.eip1559.maxPriorityFeePerGas),
        this.gasPriceType
      ),
      maxPriorityFeePerGas = getPriorityFeeBasedOnType(
        toBN(this.eip1559.maxPriorityFeePerGas),
        gasPriceTypes.FAST
      );
    const baseFee = getBaseFeeBasedOnType(
      toBN(this.eip1559.baseFeePerGas),
      this.gasPriceType
    );
    return {
      baseFeePerGas: baseFee,
      maxFeePerGas: baseFee.add(priorityFee),
      priorityFeePerGas: priorityFee,
      maxPriorityFeePerGas
    };
  }
};
interface FiatValueOptions {
  doNotLocalize?: boolean;
}
export type Getters = {
  Networks: Nodes;
  network: Node;
  gasPrice: string;
  isEthNetwork: boolean;
  getLocalContracts: any;
  currencyConfig: { currency: any; rate: any };
  getFiatValue: () => (
    value: string | number | BigNumber,
    options: FiatValueOptions
  ) => string;
  isTestNetwork: any;
  hasSwap: boolean;
  swapLink: string;
  isEIP1559SupportedNetwork: boolean;
  gasFeeMarketInfo: {
    baseFeePerGas: BN;
    maxFeePerGas: BN;
    priorityFeePerGas: BN;
    maxPriorityFeePerGas: BN;
  };
  gasPriceByType: () => (type: GasTypes) => string;
};
export default getters;
