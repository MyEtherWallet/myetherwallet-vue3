import localStore from 'store';
import Configs from '../configs';
import { PiniaActionAdaptor } from '../types';
import { ThisStore } from './types';

const actions: PiniaActionAdaptor<Actions, ThisStore> = {
  INIT_STORE() {
    if (localStore.get(Configs.LOCAL_STORAGE_KEYS.addressBook)) {
      const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.addressBook);
      if (savedStore.stateVersion === Configs.VERSION.addressBook) {
        Object.assign(this, savedStore);
      }
    }
  }
};

export type Actions = {
  INIT_STORE: () => void;
};
export default actions;
