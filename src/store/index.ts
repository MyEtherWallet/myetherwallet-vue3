import { createStore } from "vuex";
import globalModule from './global.js';
import popups from './popups.js';
import wallet from './wallet.js';
import notifications from './notifications.js';
import externalData from './external.js';
import swap from './swap.js';
import custom from './custom.js';
import addressBook from './addressBook.js';
import article from './article.js';
import Configs from './configs.js';
import LocalStore from 'store.js';
import { dappStore } from '@/dapps/dappsStore.js';

const store = createStore({
  modules: {
    globalModule: globalModule,
    popups: popups,
    wallet: wallet,
    notifications: notifications,
    externalData: externalData,
    swap: swap,
    custom: custom,
    addressBook: addressBook,
    article: article,
    ...dappStore
  }
});

store.subscribe((mutation, state) => {
  const modules = Object.keys(state);
  modules.forEach((m) => {
    if (mutation.type.startsWith(m) && state[m].localStore) {
      LocalStore.set(Configs.LOCAL_STORAGE_KEYS[m], state[m]);
    }
  });
});

export default store;