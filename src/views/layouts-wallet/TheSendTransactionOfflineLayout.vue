<template>
  <the-wrapper-wallet :total-left-col-items="1" :total-right-col-items="2">
    <template #leftColItem1>
      <module-send-offline />
    </template>
  </the-wrapper-wallet>
</template>

<script setup lang="ts">
//import ModuleSendOffline from '@/modules/send-offline/ModuleSendOffline.vue';
import TheWrapperWallet from '@/core/components/TheWrapperWallet.vue';
</script>
