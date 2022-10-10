import BigNumber from 'bignumber.js/bignumber';
import {
  formatFloatingPointValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import abi from '@/modules/balance/handlers/abiERC20.js';
//import { ERROR, Toast } from "@/modules/toast/handler/handlerToast";
import { isValidAddress } from 'ethereumjs-util/dist/';
import { State } from './types';
import { useGlobalStore } from '../global';

const setCustomToken = function (this:State,token: any) {
  const { network } = useGlobalStore()
  let customTokensByNetwork = this.tokens[network.type.name];
  if (!this.tokens[network.type.name]) {
    customTokensByNetwork = [];
  }
  const found = customTokensByNetwork.findIndex(
    t => t.contract.toLowerCase() === token.contract.toLowerCase()
  );
  if (found !== -1) {
    customTokensByNetwork[found] = token;
  } else {
    customTokensByNetwork.unshift(token);
  }
  //Vue.set(state.tokens, network.type.name, customTokensByNetwork);
};

const deleteToken = function (this:State,
  token: any
) {
  const { network } = useGlobalStore()
  const currentCustomTokens = this.tokens[network.type.name].filter(
    (currentTokens) => {
      const found = token.find((item:any) => {
        if (item.address === currentTokens.contract) {
          return item;
        }
      });
      if (!found) {
        return currentTokens;
      }
    }
  );
  //Vue.set(state.tokens, network.type.name, currentCustomTokens);
};

const deleteAll = function (this:State) {
  const { network } = useGlobalStore()
  let customTokensByNetwork = this.tokens[network.type.name];
  customTokensByNetwork = [];
  //Vue.set(state.tokens, network.type.name, customTokensByNetwork);
};

const setAddressBook = function (this:State,
  addressBook: Array<string>
) {
  this.addressBook = addressBook;
};

const addCustomPath = function (this:State, path:any) {
  this.paths.push(path);
};

const deleteCustomPath = function (this:State, paths:any) {
  const idx = this.paths.findIndex((item) => {
    if (item.path === paths.path) {
      return item;
    }
  });

  if (idx >= 0) {
    this.paths.splice(idx, 1);
  }
};

const updateCustomTokenBalances = function ({
  dispatch,
  getters,
  rootState
}: ActionContext<State, any>) {
  const _getTokenBalance = (balance, decimals) => {
    let n = new BigNumber(balance);
    if (decimals) {
      n = n.div(new BigNumber(10).pow(decimals));
      n = formatFloatingPointValue(n);
    } else {
      n = formatIntegerValue(n);
    }
    return n;
  };
  if (getters.hasCustom) {
    getters.customTokens.forEach(item => {
      const newToken = Object.assign({}, item);
      if (!isValidAddress(item.contract)) return;
      const newContract = new rootState.wallet.web3.eth.Contract(
        abi,
        item.contract
      );
      newContract.methods
        .balanceOf(rootState.wallet.address)
        .call()
        .then(res => {interface This extends State {
        }
};
