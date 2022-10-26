import { PiniaActionAdaptor } from './../types';
import { ThisStore } from './types';
import localStore from 'store';
import Configs from '../configs';
// import Notification from '@/modules/notifications/handlers/handlerNotification';
// import NonChainNotification from '@/modules/notifications/handlers/nonChainNotification.js';

const actions: PiniaActionAdaptor<Actions, ThisStore> = {
  // const INIT_STORE = function (state) {
  //   if (localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications)) {
  //     const savedStore = localStore.get(Configs.LOCAL_STORAGE_KEYS.notifications);
  //     savedStore.notifications = savedStore.notifications.map(item => {
  //       delete item.notification;
  //       return item.hasOwnProperty('hash')
  //         ? new Notification(item)
  //         : new NonChainNotification(item);
  //     });
  //     if (savedStore.stateVersion === Configs.VERSION.notifications) {
  //       Object.assign(state, savedStore);
  //     }
  //   }
  // };

  addNotification(obj: any) {
    delete obj.notification;
    if (this.notifications.length >= 20) {
      this.notifications.shift();
    }
    this.notifications.push(obj);
  },
  updateNotification(obj: any) {
    delete obj.notification;

    this.notifications = this.notifications.map(item => {
      if (item.hash === obj.hash) {
        item = obj;
      }
      return item;
    });
  },
  deleteNotification(obj: any) {
    this.notifications = this.notifications.filter(item => {
      if (item.hash !== obj.hash) return item;
    });
  }
};

// Does not exist in state
// const setFetchTime = function () {
//   this.lastFetched = new Date().getTime();
// };
export type Actions = {
  addNotification: (obj: any) => void;
  updateNotification: (obj: any) => any;
  deleteNotification: (obj: any) => any;
};
export default actions;
