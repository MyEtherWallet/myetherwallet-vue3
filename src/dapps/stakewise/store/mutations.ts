import localStore from "store";
import Configs from "./configs";
import { State } from "./types";

const INIT_STORE = function (state: State) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.stakewise);
    if (savedStore.stateVersion === Configs.VERSION.stakewise) {
      Object.assign(state, savedStore);
    }
  }
};

const SET_POOL_SUPPLY = function (state: State, val: string) {
  state.poolSupply = val;
};
const SET_STAKING_FEE = function (state: State, val: string) {
  state.stakingFee = val;
};
const SET_VALIDATOR_APR = function (state: State, val: string) {
  state.validatorApr = val;
};

const SET_RETH_BALANCE = function (state: State, val: string) {
  state.rethBalance = val;
};

const SET_SETH_BALANCE = function (state: State, val: string) {
  state.sethBalance = val;
};

const ADD_TO_PENDING_TXS = function (state: State, val: any) {
  state.stakewiseTxs.ETH.push(val);
};

const ADD_TO_PENDING_TXS_GOERLI = function (state: State, val: any) {
  state.stakewiseTxs.GOERLI.push(val);
};

const REMOVE_TO_PENDING_TXS = function (state: State, val: any) {
  state.stakewiseTxs.ETH = state.stakewiseTxs.ETH.filter((item) => {
    return item.hash !== val;
  });
};

const REMOVE_TO_PENDING_TXS_GOERLI = function (state: State, val: any) {
  state.stakewiseTxs.GOERLI = state.stakewiseTxs.GOERLI.filter((item) => {
    return item.hash !== val;
  });
};

export default {
  INIT_STORE,
  SET_POOL_SUPPLY,
  SET_STAKING_FEE,
  SET_VALIDATOR_APR,
  ADD_TO_PENDING_TXS,
  ADD_TO_PENDING_TXS_GOERLI,
  REMOVE_TO_PENDING_TXS,
  REMOVE_TO_PENDING_TXS_GOERLI,
  SET_RETH_BALANCE,
  SET_SETH_BALANCE,
};
