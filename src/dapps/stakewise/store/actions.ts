import { ActionContext } from "vuex";
import { State } from "./types";

const setPoolSupply = function (
  { commit }: ActionContext<State, any>,
  val: string
) {
  commit("SET_POOL_SUPPLY", val);
};
const setStakingFee = function (
  { commit }: ActionContext<State, any>,
  val: string
) {
  commit("SET_STAKING_FEE", val);
};
const setValidatorApr = function (
  { commit }: ActionContext<State, any>,
  val: string
) {
  commit("SET_VALIDATOR_APR", val);
};
const addToPendingTxs = function (
  { commit }: ActionContext<State, any>,
  val: any
) {
  commit("ADD_TO_PENDING_TXS", val);
};
const addToPendingTxsGoerli = function (
  { commit }: ActionContext<State, any>,
  val: any
) {
  commit("ADD_TO_PENDING_TXS_GOERLI", val);
};
const removePendingTxs = function (
  { commit }: ActionContext<State, any>,
  val: any
) {
  commit("REMOVE_TO_PENDING_TXS", val);
};
const removePendingTxsGoerli = function (
  { commit }: ActionContext<State, any>,
  val: any
) {
  commit("REMOVE_TO_PENDING_TXS_GOERLI", val);
};

const setRewardBalance = function (
  { commit }: ActionContext<State, any>,
  val: string
) {
  commit("SET_RETH_BALANCE", val);
};

const setStakeBalance = function (
  { commit }: ActionContext<State, any>,
  val: string
) {
  commit("SET_SETH_BALANCE", val);
};

export default {
  setPoolSupply,
  setStakingFee,
  setValidatorApr,
  addToPendingTxs,
  addToPendingTxsGoerli,
  removePendingTxs,
  removePendingTxsGoerli,
  setRewardBalance,
  setStakeBalance,
};
