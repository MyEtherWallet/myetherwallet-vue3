import localStore from 'store';
import Configs from './configs';
import { This } from './types';

const INIT_STORE = function (this: This) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.ensManagerStore)) {
    const savedStore = localStore.get(
      Configs.LOCAL_STORAGE_KEYS.ensManagerStore
    );
    if (savedStore.stateVersion === Configs.VERSION.ensManagerStore) {
      Object.assign(this, savedStore);
    }
  }
};
export interface Actions {
  INIT_STORE: typeof INIT_STORE;
}
export default {
  INIT_STORE
};
