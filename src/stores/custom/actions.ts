import { useCustomStore } from './index';
import BigNumber from 'bignumber.js/bignumber';
import { fromBase } from '@/core/helpers/unit';
import {
  formatFloatingPointValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
//import abi from '@/modules/balance/handlers/abiERC20.js';
//import { ERROR, Toast } from '@/modules/toast/handler/handlerToast';
import { isValidAddress } from 'ethereumjs-util/dist/';
import { This } from './types';
import { useGlobalStore } from '../global';
import { useWalletStore } from '../wallet';

const setCustomToken = function (this: This, token: any) {
  const globalStore = useGlobalStore();
  const network = globalStore.network;
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

const deleteToken = function (this: This, token: any) {
  const {network} = useGlobalStore();
  const {customTokens} = useCustomStore();
  const currentCustomTokens = this.tokens[network.type.name].filter(
    currentTokens => {
      const found = token.find((item: any) => {
        if (item.address === currentTokens.contract) {
          return item;
        }
      });
      // Check if token is in hiddenTokens
      const hiddenTokens = customTokens;
      if (found && hiddenTokens.length > 0) {
        const newHiddenTokens = hiddenTokens.filter(item => {
          return found.address !== item.address;
        });
        //Vue.set(state.hiddenTokens, network.type.name, newHiddenTokens);
      }
      if (!found) {
        return currentTokens;
      }
    }
  );
  //Vue.set(state.tokens, network.type.name, currentCustomTokens);
};

const deleteAll = function (this: This) {
  const globalStore = useGlobalStore();
  const network = globalStore.network;
  let customTokensByNetwork = this.tokens[network.type.name];
  customTokensByNetwork = [];
  //Vue.set(state.tokens, network.type.name, customTokensByNetwork);
};

const setHiddenToken = function (this: This, token: any) {
  const globalStore = useGlobalStore();
  const network = globalStore.network;
  let hiddenTokensByNetwork = this.hiddenTokens[network.type.name];
  if (!this.hiddenTokens[network.type.name]) {
    hiddenTokensByNetwork = [];
  }
  const found = hiddenTokensByNetwork.findIndex(
    (t: any) => t.address.toLowerCase() === token.address.toLowerCase()
  );
  if (found !== -1) {
    hiddenTokensByNetwork[found] = token;
  } else {
    hiddenTokensByNetwork.unshift(token);
  }
  //Vue.set(state.hiddenTokens, network.type.name, hiddenTokensByNetwork);
};

const deleteHiddenToken = function (this: This, token: any) {
  const globalStore = useGlobalStore();
  const network = globalStore.network;
  const currentHiddenTokens = this.hiddenTokens[network.type.name].filter(
    (currentTokens: any) => {
      const found = token.find((item: any) => {
        if (item.address === currentTokens.address) {
          return item;
        }
      });
      if (!found) {
        return currentTokens;
      }
    }
  );
  //Vue.set(state.hiddenTokens, network.type.name, currentHiddenTokens);
};

const addCustomPath = function (this: This, path: any) {
  this.paths.push(path);
};

const deleteCustomPath = function (this: This, path: any) {
  this.paths = this.paths.filter(p => p.value !== path.value);
};
const deleteAllCustomPaths = function (this: This) {
  this.paths = [];
};

// const updateCustomTokenBalances = function (this: This) {
//   const walletStore = useWalletStore();
//   const _getTokenBalance = (balance: string | number, decimals: number) => {
//     let n: BigNumber | string | any = new BigNumber(balance);
//     if (decimals) {
//       n = fromBase(balance, decimals);
//       n = formatFloatingPointValue(n);
//     } else {
//       n = formatIntegerValue(n);
//     }
//     return n;
//   };
//   if (this.hasCustom()) {
//     this.customTokens().forEach((item: any) => {
//       const newToken = Object.assign({}, item);
//       if (!isValidAddress(item.contract)) return;
//       const newContract = new walletStore.web3.eth.Contract(abi, item.contract);
//       newContract.methods
//         .balanceOf(walletStore.address)
//         .call()
//         .then((res: any) => {
//           newToken.balancef = _getTokenBalance(res, item.decimals).value;
//           newToken.balance = res;
//           this.setCustomToken(newToken);
//         });
//       //.catch(e => Toast(e.message, {}, ERROR));
//     });
//   }
// };
export interface Actions {
  setCustomToken: typeof setCustomToken;
  deleteAll: typeof deleteAll;
  deleteToken: typeof deleteToken;
  addCustomPath: typeof addCustomPath;
  deleteCustomPath: typeof deleteCustomPath;
  deleteAllCustomPaths: typeof deleteAllCustomPaths;
  // updateCustomTokenBalances: typeof updateCustomTokenBalances;
  setHiddenToken: typeof setHiddenToken;
  deleteHiddenToken: typeof deleteHiddenToken;
}

export default {
  setCustomToken,
  deleteAll,
  deleteToken,
  addCustomPath,
  deleteCustomPath,
  deleteAllCustomPaths,
  // updateCustomTokenBalances,
  setHiddenToken,
  deleteHiddenToken
};
