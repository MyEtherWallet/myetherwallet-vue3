import { fromWei } from "web3-utils";
import { formatFloatingPointValue } from "@/core/helpers/numberFormatHelper";
import BigNumber from "bignumber.js";
import { toBNSafe } from "@/core/helpers/numberFormatHelper";
import { State } from "./types";

const getPoolSupply = function (state: State) {
  return fromWei(toBNSafe(state.poolSupply));
};

const getStakingFee = function (state: State) {
  return formatFloatingPointValue(BigNumber(state.stakingFee).div(100)).value;
};
export default { getPoolSupply, getStakingFee };
