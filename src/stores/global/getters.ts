import { GasTypes } from './../../core/helpers/gasPriceHelper';
import nodeList from '@/utils/networks';
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
import { This } from './types';
import BigNumber from 'bignumber.js/bignumber';
import { useExternalStore } from '../external';
import { useWalletStore } from '../wallet';
const Networks = function () {
  return nodeList;
};
const network = function (this: This) {
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
      break;
    }
  }
  return network;
};
const gasPriceByType = () =>
  function (this: This, type: GasTypes = 'economy') {
    if (!this.isEIP1559SupportedNetwork()) {
      return getGasBasedOnType(this.baseGasPrice, type);
    }
    const priorityFee = getPriorityFeeBasedOnType(
      toBN(this.eip1559.maxPriorityFeePerGas),
      type
    );
    const baseFee = getBaseFeeBasedOnType(
      toBN(this.eip1559.baseFeePerGas),
      type
    );
    return baseFee.add(priorityFee).toString();
  };
const gasPrice = function (this: This) {
  if (!this.isEIP1559SupportedNetwork()) {
    return getGasBasedOnType(this.baseGasPrice, this.gasPriceType);
  }
  return this.gasFeeMarketInfo().maxFeePerGas.toString();
};

const isEthNetwork = function (this: This) {
  return this.network().type.name === ETH.name;
};
const isTestNetwork = function (this: This) {
  return this.network().type.isTestNetwork;
};

const getLocalContracts = function (this: This): Array<any> | any {
  return this.localContracts[this.network().type.name]
    ? this.localContracts[this.network().type.name]
    : [];
};

const hasSwap = function (this: This) {
  const { instance } = useWalletStore();
  const name = this.network().type.name;
  const device = instance.identifier;

  if (device === WALLET_TYPES.COOL_WALLET_S) return false;
  return name === ETH.name || name === BSC.name || name === MATIC.name;
};

const swapLink = function (this: This) {
  const { address } = useWalletStore();
  const hasAddress = address;
  const link = 'https://ccswap.myetherwallet.com/#/';
  return hasAddress ? `${link}?to=${hasAddress}` : link;
};
const currencyConfig = function (this: This) {
  const currency = this.preferredCurrency;
  const externalStore = useExternalStore();
  const rate = externalStore.currencyRate.data
    ? externalStore.currencyRate.data.exchange_rate
    : 1;
  return { currency, rate };
};
/**
 * @param {Number|String} value
 * @param {Object} options
 * @param {Boolean} options.doNotLocalize - formats value to currency, no rate
 * @returns - Formatted localized currency
 */
interface FiatValueOptions {
  doNotLocalize?: boolean;
}
const getFiatValue = ()=>function (
  this: This,
  value: string | number | BigNumber,
  options: FiatValueOptions = {}
) {
  const config: any = options.doNotLocalize
    ? { currency: this.currencyConfig().currency }
    : this.currencyConfig;
  return formatFiatValue(value, config).value;
};

const isEIP1559SupportedNetwork = function (this: This) {
  return this.eip1559.baseFeePerGas !== '0';
};
const gasFeeMarketInfo = function (this: This) {
  const priorityFee = getPriorityFeeBasedOnType(
    toBN(this.eip1559.maxPriorityFeePerGas),
    this.gasPriceType
  );
  const maxPriorityFeePerGas = getPriorityFeeBasedOnType(
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
};
export interface Getters {
  Networks: typeof Networks;
  network: typeof network;
  gasPrice: typeof gasPrice;
  isEthNetwork: typeof isEthNetwork;
  getLocalContracts: typeof getLocalContracts;
  currencyConfig: typeof currencyConfig;
  getFiatValue: typeof getFiatValue;
  isTestNetwork: typeof isTestNetwork;
  hasSwap: typeof hasSwap;
  swapLink: typeof swapLink;
  isEIP1559SupportedNetwork: typeof isEIP1559SupportedNetwork;
  gasFeeMarketInfo: typeof gasFeeMarketInfo;
  gasPriceByType: typeof gasPriceByType;
}
export default {
  Networks,
  network,
  gasPrice,
  isEthNetwork,
  getLocalContracts,
  currencyConfig,
  getFiatValue,
  isTestNetwork,
  hasSwap,
  swapLink,
  isEIP1559SupportedNetwork,
  gasFeeMarketInfo,
  gasPriceByType
};
