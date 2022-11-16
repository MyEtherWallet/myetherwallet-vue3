<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-nft-manager />
    </template>
  </the-wrapper-wallet>
</template>

<script setup lang="ts">
import TheWrapperWallet from '@/core/components/TheWrapperWallet.vue';
import ModuleNftManager from '@/modules/nft-manager/ModuleNftManager.vue';
</script>
