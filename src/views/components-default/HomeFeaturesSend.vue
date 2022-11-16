<template>
  <mew6-white-sheet
    class="mew-component--features-send pa-6 pa-md-10 no-pointer-events"
    max-width="700px"
  >
    <div class="mew-heading-1 mb-3">
      {{ $t('home.features.eth.title') }}
    </div>
    <div class="mt-10">
      <v-row>
        <v-col cols="12" md="6">
          <mew-select label="Type" :items="tokens" />
        </v-col>
        <v-col cols="12" md="6">
          <mew-input
            v-model="data"
            placeholder="0x..."
            :label="$t('sendTx.amount')"
          />
        </v-col>
        <v-col cols="12" class="mt-n5">
          <module-address-book is-home-page />
        </v-col>
      </v-row>
    </div>
  </mew6-white-sheet>
</template>

<script setup lang="ts">
//import ModuleAddressBook from '@/modules/address-book/ModuleAddressBook.vue';
import { useGlobalStore } from '@/stores/global';
import { useWalletStore } from '@/stores/wallet';
import { computed, reactive } from 'vue';

const { data } = reactive({
  data: '1337'
});
const { network } = useGlobalStore();
const { balance, tokensList } = useWalletStore();
const tokens = computed(() => {
  const eth = {
    name: network.type.name,
    symbol: network.type.name,
    subtext: network.type.name_long,
    value: network.type.name_long,
    balance: balance,
    img: network.type.icon,
    decimals: 18,
    market_cap: null,
    price_change_percentage_24h: null
  };

  const copiedTokens = tokensList.slice();
  copiedTokens.unshift(eth);
  return copiedTokens;
});
</script>

<style lang="scss" scoped></style>
