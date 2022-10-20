import url from 'url';
import web3 from 'web3/types';
import MEWProvider from '@/utils/web3-provider';
import WALLET_TYPES from '@/modules/access-wallet/common/walletTypes';
import { formatters } from 'web3-core-helpers';
//import EventNames from '@/utils/web3-provider/events';
//import { EventBus } from '@/core/plugins/eventBus';
import { This } from './types';
import { useGlobalStore } from '../global';
const removeWallet = function (this: This) {
  if (
    this.identifier === WALLET_TYPES.WALLET_CONNECT ||
    this.identifier === WALLET_TYPES.WALLET_LINK ||
    this.identifier === WALLET_TYPES.MEW_CONNECT
  ) {
    const connection = this.instance.getConnection();
    if (connection && connection.disconnect) {
      connection.disconnect();
    }
  }
  this.instance = null;
  this.balance = '0';
  this.address = null;
  this.isHardware = false;
  this.identifier = '';
};

const setWallet = function (this: This, params: Array<any>) {
  const wallet = params[0];
  this.instance = wallet;
  this.address = wallet.getAddressString();
  this.isHardware = Object.prototype.hasOwnProperty.call(wallet, 'isHardware')
    ? wallet.isHardware
    : false;
  this.identifier = wallet.identifier;
  if (!Object.prototype.hasOwnProperty.call(wallet, 'isHardware')) {
    this.nickname = wallet.getNickname();
  }
  //dispatch('setWeb3Instance', params[1]);
};

const setWeb3Instance = function (this: This, provider?: string) {
  const { currentNetwork, network, gasPrice, Networks } = useGlobalStore();
  const hostUrl = currentNetwork.url
    ? url.parse(currentNetwork.url)
    : url.parse(Networks['ETH'][0].url);
  const options: any = {};
  // eslint-disable-next-line
  const parsedUrl = `${hostUrl.protocol}//${hostUrl.host}${
    currentNetwork.port ? ':' + currentNetwork.port : ''
  }${hostUrl.pathname}`;
  currentNetwork.username !== '' && currentNetwork.password !== ''
    ? (options['headers'] = {
        authorization: `Basic: ${btoa(
          currentNetwork.username + ':' + currentNetwork.password
        )}`
      })
    : {};
  const web3Instance: any = new web3();
  //new MEWProvider(provider ? provider : parsedUrl, options)
  web3Instance.eth.transactionConfirmationBlocks = 1;
  web3Instance['mew'] = {};
  web3Instance['mew'].sendBatchTransactions = (arr: Array<any>) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
      for (let i = 0; i < arr.length; i++) {
        const localTx = {
          to: arr[i].to,
          data: arr[i].data,
          from: arr[i].from,
          value: arr[i].value
        };
        const gas = await (arr[i].gas === undefined
          ? web3Instance.eth.estimateGas(localTx)
          : arr[i].gas);
        const nonce = await (arr[i].nonce === undefined
          ? web3Instance.eth.getTransactionCount(this.address)
          : arr[i].nonce);
        arr[i].nonce = web3.utils.toBN(nonce).addn(i).toString();
        arr[i].gas = gas;
        arr[i].gasLimit = gas;
        arr[i].chainId = !arr[i].chainId
          ? network.type.chainID
          : arr[i].chainId;
        arr[i].gasPrice =
          arr[i].gasPrice === undefined ? gasPrice : arr[i].gasPrice;
        arr[i] = formatters.inputCallFormatter(arr[i]);
      }

      // const batchSignCallback = promises => {
      //   resolve(promises);
      // };
      // EventBus.$emit(
      //   EventNames.SHOW_BATCH_TX_MODAL,
      //   arr,
      //   batchSignCallback,
      //   state.isHardware
      // );
    });
  };
  this.web3 = web3Instance;
};
export interface Actions {
  removeWallet: typeof removeWallet;
  setWallet: typeof setWallet;
  setWeb3Instance: typeof setWeb3Instance;
}

export default {
  removeWallet,
  setWallet,
  setWeb3Instance
};
