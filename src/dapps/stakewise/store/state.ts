import Configs from "./configs";
import { State } from "./types";

const stakewise: State = {
  localStore: true,
  stakewiseTxs: { ETH: [], GOERLI: [] },
  validatorApr: "0",
  poolSupply: "0",
  stakingFee: "0",
  stateVersion: Configs.VERSION.stakewise,
  rethBalance: "0",
  sethBalance: "0",
};

export default stakewise;
