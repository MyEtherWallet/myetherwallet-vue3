<template>
  <the-wrapper-wallet>
    <template #leftColItem1>
      <module-contract-deploy />
    </template>
    <template #rightColItem1>
      <module-swap-rates />
    </template>
  </the-wrapper-wallet>
</template>

<script setup lang="ts">
import TheWrapperWallet from '@/core/components/TheWrapperWallet.vue';
// import ModuleSwapRates from '@/modules/swap/ModuleSwapRates.vue';
// import ModuleContractDeploy from '@/modules/contract/ModuleContractDeploy.vue';
</script>
