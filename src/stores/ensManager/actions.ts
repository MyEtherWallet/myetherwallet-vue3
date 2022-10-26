import localStore from 'store';
import { PiniaActionAdaptor } from '../types';
import Configs from './configs';
import { ThisStore } from './types';

const actions: PiniaActionAdaptor<Actions, ThisStore> = {
  INIT_STORE() {
    if (localStore.get(Configs.LOCAL_STORAGE_KEYS.ensManagerStore)) {
      const savedStore = localStore.get(
        Configs.LOCAL_STORAGE_KEYS.ensManagerStore
      );
      if (savedStore.stateVersion === Configs.VERSION.ensManagerStore) {
        Object.assign(this, savedStore);
      }
    }
  }
};

export type Actions = {
  INIT_STORE: () => void;
};
export default actions;
