<template>
  <mew6-white-sheet class="px-5 px-lg-7 py-5 d-flex justify-space-between">
    <div>
      <h2 class="pb-3">{{ tokenTitle }}</h2>
      <h2 class="pb-3">$ {{ totalTokenValues }}</h2>
      <v-row justify="space-around">
        <v-col v-for="(img, idx) in tokenImages" :key="idx + img" cols="2">
          <img :src="img" height="32px" />
        </v-col>
        <v-col cols="2">
          <div class="circled-total">+{{ walletStore.tokensList.length }}</div>
        </v-col>
      </v-row>
    </div>
  </mew6-white-sheet>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import BigNumber from 'bignumber.js/bignumber';
import { useWalletStore } from '@/stores/wallet';
import { useGlobalStore } from '@/stores/global';
// ...mapGetters('wallet', ['tokensList']),
// ...mapGetters('global', ['getFiatValue']),
const walletStore = useWalletStore();
const globalStore = useGlobalStore();

const tokenTitle = computed(() => {
  return `My Token${walletStore.tokensList.length > 1 ? 's' : ''} Value`;
});

const totalTokenValues = computed(() => {
  let total = BigNumber(0);
  walletStore.tokensList.forEach(token => {
    const value = token.usdBalance ? token.usdBalance : 0;
    total = total.plus(value);
  });
  return globalStore.getFiatValue()(total);
});

const tokenImages = computed(() => {
  const firstFive = walletStore.tokensList.slice(0, 5);
  return firstFive.map(item => {
    return item.img;
  });
});
</script>
<style lang="scss" scoped>
.circled-total {
  border-radius: 50%;
  width: 32px;
  height: 32px;
  padding-top: 5px !important;
  color: #05c0a5;
  border: 1px dashed #05c0a5;
  text-align: center;
}
</style>
