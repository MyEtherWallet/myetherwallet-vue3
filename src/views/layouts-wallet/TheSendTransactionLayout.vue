<template>
  <the-wrapper-wallet :total-left-col-items="1" :total-right-col-items="2">
    <template #leftColItem1>
      <module-send />
    </template>
    <template #rightColItem1>
      <module-tokens-value />
    </template>
    <template v-if="hasHistory" #rightColItem2>
      <module-transfer-history />
    </template>
  </the-wrapper-wallet>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notifications';

// import ModuleSend from '@/modules/send/ModuleSend.vue';
import TheWrapperWallet from '@/core/components/TheWrapperWallet.vue';
import { computed } from 'vue';
// import ModuleTokensValue from '@/modules/balance/ModuleTokensValue.vue';
// import ModuleTransferHistory from '@/modules/transfer-history/ModuleTransferHistory.vue';
const notificationStore = useNotificationStore();
const hasHistory = computed(() => {
  return (
    notificationStore.txNotifications &&
    notificationStore.txNotifications.length > 0
  );
});
</script>
