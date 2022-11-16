<template>
  <the-wrapper-wallet :total-left-col-items="2" :total-right-col-items="2">
    <template #leftColItem1>
      <module-balance />
    </template>
    <template #leftColItem2>
      <module-tokens />
    </template>
    <template #rightColItem1>
      <module-swap-rates />
    </template>
    <template #rightColItem2>
      <app-carousel />
    </template>
  </the-wrapper-wallet>
</template>

<script setup lang="ts">
import AppCarousel from '@/core/components/AppCarousel.vue';
// import ModuleBalance from '@/modules/balance/ModuleBalance.vue';
// import ModuleTokens from '@/modules/balance/ModuleTokens.vue';
// import ModuleSwapRates from '@/modules/swap/ModuleSwapRates.vue';
import TheWrapperWallet from '@/core/components/TheWrapperWallet.vue';
</script>
