<template>
  <the-wrapper-wallet :total-left-col-items="1" :total-right-col-items="2">
    <template #leftColItem1>
      <module-swap
        :is-available="hasSwap"
        :from-token="fromToken"
        :to-token="toToken"
        :amount="amount"
      />
    </template>
    <template #rightColItem1>
      <module-tokens-value />
    </template>
    <template v-if="hasHistory && hasSwap" #rightColItem2>
      <module-transfer-history :is-swap="true" />
    </template>
  </the-wrapper-wallet>
</template>

<script setup lang="ts">
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { useGlobalStore } from '@/stores/global';
import { useNotificationStore } from '@/stores/notifications';
import { computed } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
//import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
import TheWrapperWallet from '@/core/components/TheWrapperWallet.vue';
import ModuleSwap from '@/modules/swap/ModuleSwap.vue';
import ModuleTokensValue from '@/modules/balance/ModuleTokensValue.vue';
import ModuleTransferHistory from '@/modules/transfer-history/ModuleTransferHistory.vue';

onBeforeRouteLeave((to, from, next) => {
  if (to.name === ROUTES_WALLET.NETWORK.NAME) {
    //this.trackSwap('switchingNetworkOnSwap');
  }
  if (
    to.name !== ROUTES_WALLET.NETWORK.NAME &&
    to.name !== ROUTES_WALLET.SWAP.NAME
  ) {
    //this.trackSwap('leavingSwapTo: ' + to.name);
  }
  next();
});

defineProps({
  //Eth Token
  fromToken: {
    type: String,
    default: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  },
  //Dai Token
  toToken: {
    type: String,
    default: '0x6b175474e89094c44da98b954eedeac495271d0f'
  },
  amount: {
    type: String,
    default: ''
  }
});
const { swapNotifications } = useNotificationStore();
const { hasSwap } = useGlobalStore();
const hasHistory = computed(() => {
  return swapNotifications && swapNotifications.length > 0;
});
</script>
