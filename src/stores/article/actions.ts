//import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import localStore from 'store';
import Configs from '../configs';
import { State } from './types';

const INIT_STORE = function (this: State) {
  if (localStore.get(Configs.LOCAL_STORAGE_KEYS.article)) {
    const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.article);
    if (savedStore.stateVersion === Configs.VERSION.article) {
      Object.assign(this, savedStore);
    }
  }
};

const Url =
  'https://raw.githubusercontent.com/MyEtherWallet/dynamic-data/main/articles.json';
/**
 * Update the articles array
 */
const updateArticles = async function (this: State, stateObj: any) {
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
};
export interface Actions {
  updateArticles: typeof updateArticles;
  INIT_STORE: typeof INIT_STORE;
}
export default { updateArticles, INIT_STORE };
