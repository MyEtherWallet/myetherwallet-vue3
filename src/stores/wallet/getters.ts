import { fromWei, toBN } from 'web3-utils/types';
import { State } from './types';
const balanceInETH = function (this: State) {
  if (!this.balance) this.balance = '0';
  return fromWei(this.balance);
};

const balanceInWei = function (this: State) {
  if (!this.balance) this.balance = '0';
  return this.balance.toString();
};

const totalOwnedDomains = function (this: State) {
  return this.ensDomains ? this.ensDomains.length : 0;
};

const tokensList = function (this: State) {
  const tokens = this.tokens;
  return tokens.length > 0
    ? tokens.map(item => {
        if (!Object.prototype.hasOwnProperty.call(item, 'balance')) {
          item.balance = toBN(0);
        } else {
          item.balance = toBN(item.balance);
        }
        return item;
      })
    : [];
};
export interface Getters {
  balanceInETH: typeof balanceInETH;
  balanceInWei: typeof balanceInWei;
  totalOwnedDomains: typeof totalOwnedDomains;
  tokensList: typeof tokensList;
}
export default {
  balanceInETH,
  balanceInWei,
  totalOwnedDomains,
  tokensList
};
