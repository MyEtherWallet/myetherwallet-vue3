import Configs from './configs';
import { State } from './types';

const ensManagerStore = (): State => ({
  localStore: true,
  showHasClaimable: true,
  stateVersion: Configs.VERSION.ensManagerStore
});

export default ensManagerStore;
