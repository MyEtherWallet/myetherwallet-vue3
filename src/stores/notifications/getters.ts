//import { NOTIFICATION_TYPES } from '@/modules/notifications/handlers/handlerNotification';
import { useGlobalStore } from '../global';
import { useWalletStore } from '../wallet';
import { This } from './types';

const currentNotifications = function (this: This) {
  const { address } = useWalletStore();
  const { network } = useGlobalStore();
  const currentNetworkType = network().type.name;
  const filteredArray = this.notifications.filter(item => {
    if (
      item.from?.toLowerCase() === address?.toLowerCase() &&
      item.network === currentNetworkType
    )
      return item;
  });
  1;
  return this.notifications.length > 0 ? filteredArray : [];
};

const txNotifications = function (this: This) {
  const { address } = useWalletStore();
  const { network } = useGlobalStore();
  const currentNetworkType = network().type.name;
  const filteredArray = this.notifications.filter(item => {
    if (
      item.from?.toLowerCase() === address?.toLowerCase() &&
      //item.type === NOTIFICATION_TYPES.OUT &&
      item.network === currentNetworkType
    )
      return item;
  });
  return this.notifications.length > 0 ? filteredArray : [];
};

const swapNotifications = function (this: This) {
  const { address } = useWalletStore();
  const { network } = useGlobalStore();
  const currentNetworkType = network().type.name;
  const filteredArray = this.notifications.filter(item => {
    if (
      item.from?.toLowerCase() === address?.toLowerCase() &&
      //item.type === NOTIFICATION_TYPES.SWAP &&
      item.network === currentNetworkType
    )
      return item;
  });
  return this.notifications.length > 0 ? filteredArray : [];
};
export interface Getters {
  currentNotifications: typeof currentNotifications;
  txNotifications: typeof txNotifications;
  swapNotifications: typeof swapNotifications;
}
export default { currentNotifications, txNotifications, swapNotifications };
