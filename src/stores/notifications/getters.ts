import { PiniaGetterAdaptor } from './../types';
//import { NOTIFICATION_TYPES } from '@/modules/notifications/handlers/handlerNotification';
import { useGlobalStore } from '../global';
import { useWalletStore } from '../wallet';
import { ThisStore } from './types';

const getters: PiniaGetterAdaptor<Getters, ThisStore> = {
  currentNotifications() {
    const { address } = useWalletStore();
    const { network } = useGlobalStore();
    const currentNetworkType = network.type.name;
    const filteredArray = this.notifications.filter(item => {
      if (
        item.from?.toLowerCase() === address?.toLowerCase() &&
        item.network === currentNetworkType
      )
        return item;
    });
    1;
    return this.notifications.length > 0 ? filteredArray : [];
  },
  txNotifications() {
    const { address } = useWalletStore();
    const { network } = useGlobalStore();
    const currentNetworkType = network.type.name;
    const filteredArray = this.notifications.filter(item => {
      if (
        item.from?.toLowerCase() === address?.toLowerCase() &&
        //item.type === NOTIFICATION_TYPES.OUT &&
        item.network === currentNetworkType
      )
        return item;
    });
    return this.notifications.length > 0 ? filteredArray : [];
  },
  swapNotifications() {
    const { address } = useWalletStore();
    const { network } = useGlobalStore();
    const currentNetworkType = network.type.name;
    const filteredArray = this.notifications.filter(item => {
      if (
        item.from?.toLowerCase() === address?.toLowerCase() &&
        //item.type === NOTIFICATION_TYPES.SWAP &&
        item.network === currentNetworkType
      )
        return item;
    });
    return this.notifications.length > 0 ? filteredArray : [];
  }
};

export type Getters = {
  currentNotifications: any;
  txNotifications: any;
  swapNotifications: any;
};
export default getters;
