type StakewiseTxs = {
  ETH: Array<any>;
  GOERLI: Array<any>;
};
export type State = {
  localStore: Boolean;
  stakewiseTxs: StakewiseTxs;
  validatorApr: string;
  poolSupply: string;
  stakingFee: string;
  stateVersion: string;
  rethBalance: string;
  sethBalance: string;
};
