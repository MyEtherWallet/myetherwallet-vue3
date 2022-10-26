//import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import localStore from 'store';
import Configs from '../configs';
import { PiniaActionAdaptor } from '../types';
import { ThisStore } from './types';
const Url =
  'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/articles.json';

const actions: PiniaActionAdaptor<Actions, ThisStore> = {
  INIT_STORE() {
    if (localStore.get(Configs.LOCAL_STORAGE_KEYS.article)) {
      const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.article);
      if (savedStore.stateVersion === Configs.VERSION.article) {
        Object.assign(this, savedStore);
      }
    }
  },

  /**
   * Update the articles array
   */
  updateArticles: async function (stateObj: any) {
    const temp = new Date(stateObj.timestamp);
    temp.setHours(72); // Add 3 days to saved timestamp
    if (
      temp.getTime() <= Date.now() ||
      !Object.keys(stateObj.articleList).length
    ) {
      try {
        const res = await fetch(Url);
        this.articleStore = await res.json();
        this.timestamp = new Date().getTime();
      } catch (err) {
        //Toast(err, {}, ERROR);
      }
    }
  }
};

export type Actions = {
  updateArticles: (stateObj: any) => Promise<void>;
  INIT_STORE: () => void;
};
export default actions;
