import { fromWei } from 'web3-utils/types';
import { formatFloatingPointValue } from '@/core/helpers/numberFormatHelper';
import BigNumber from 'bignumber.js/bignumber';
import { toBNSafe } from '@/core/helpers/numberFormatHelper';
import { This } from './types';

const getPoolSupply = function (this: This) {
  return fromWei(toBNSafe(this.poolSupply));
};

const getStakingFee = function (this: This) {
  return formatFloatingPointValue(BigNumber(this.stakingFee).div(100)).value;
};
export interface Getters {
  getPoolSupply: typeof getPoolSupply;
  getStakingFee: typeof getStakingFee;
}
export default { getPoolSupply, getStakingFee };
