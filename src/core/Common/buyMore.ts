/**
 * The Wallet View Apollo Mixin
 */
import { EventBus } from '@/plugins/eventBus';
import { MOONPAY_EVENT } from '@/modules/moon-pay/helpers';
export const useBuyMore = () => {
  const openMoonpay = () => {
    EventBus.$emit(MOONPAY_EVENT);
  };
  return { openMoonpay };
};
