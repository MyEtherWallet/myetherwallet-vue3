import { PiniaGetterAdaptor } from './../types';
import { fromWei } from 'web3-utils';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import BigNumber from 'bignumber.js';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
import { ThisStore } from './types';

const getters: PiniaGetterAdaptor<Getters, ThisStore> = {
  getPoolSupply() {
    return fromWei(toBNSafe(this.poolSupply));
  },
  getStakingFee() {
    return formatFloatingPointValue(BigNumber(this.stakingFee).div(100)).value;
  }
};

export type Getters = {
  getPoolSupply: string;
  getStakingFee: string;
};

export default getters;
