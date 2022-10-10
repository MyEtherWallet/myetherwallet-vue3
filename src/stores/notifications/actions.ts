import { State } from './types';
import localStore from 'store';
import Configs from '../configs';
// import Notification from '@/modules/notifications/handlers/handlerNotification';
// import NonChainNotification from '@/modules/notifications/handlers/nonChainNotification.js';

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

const addNotification = function (this: State, obj: any) {
  delete obj.notification;
  if (this.notifications.length >= 20) {
    this.notifications.shift();
  }
  this.notifications.push(obj);
};
const updateNotification = function (this: State, obj: any) {
  delete obj.notification;

  this.notifications = this.notifications.map(item => {
    if (item.hash === obj.hash) {
      item = obj;
    }
    return item;
  });
};
const deleteNotification = function (this: State, obj: any) {
  this.notifications = this.notifications.filter(item => {
    if (item.hash !== obj.hash) return item;
  });
};
// Does not exist in state
// const setFetchTime = function (this: State) {
//   this.lastFetched = new Date().getTime();
// };
export interface Actions {
  addNotification: typeof addNotification;
  updateNotification: typeof updateNotification;
  deleteNotification: typeof deleteNotification;
}
export default {
  addNotification,
  updateNotification,
  deleteNotification
};
