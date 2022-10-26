import { fromWei, toBN } from 'web3-utils/types';
import { PiniaGetterAdaptor } from '../types';
import { ThisStore } from './types';
const getters: PiniaGetterAdaptor<Getters, ThisStore> = {
  balanceInETH(this): string {
    if (!this.balance) this.balance = '0';
    return fromWei(this.balance);
  },
  balanceInWei(): string {
    if (!this.balance) this.balance = '0';
    return this.balance.toString();
  },
  totalOwnedDomains(): number {
    return this.ensDomains ? this.ensDomains.length : 0;
  },
  tokensList(): Array<any> {
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
  }
};

export default getters;

export type Getters = {
  balanceInETH: string;
  balanceInWei: string;
  totalOwnedDomains: number;
  tokensList: Array<any>;
};
