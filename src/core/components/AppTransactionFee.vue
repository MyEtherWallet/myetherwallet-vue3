<template>
  <div class="core--components--app-transaction-fee">
    <!--
    =====================================================
      AppModal
    =====================================================
    -->
    <app-modal
      :show="state.openHighFeeNote"
      :close="closeHighFeeNote"
      :has-buttons="false"
    >
      <template #dialogBody>
        <div class="mew-heading-1 mb-2">How are fees determined?</div>
        <div class="mt-6 textLight--text">
          Transaction fees are charged by Ethereum miners, not MEW. We can't
          influence them and we don't receive any part of the transaction fees
          that you pay.
        </div>
        <div class="mew-heading-1 my-2 mt-6">What should I do?</div>
        <div class="mt-6 textLight--text">
          Good news! You have options! If you’re not in a hurry, you can use the
          “Normal” setting and your transaction will be mined at a later time.
          MEW supports Ethereum scaling solutions Polygon and Binance Smart
          Chain (accessible on MEW web and Android). Consider using these chains
          to avoid congestion and save on fees. Learn how
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://help.myetherwallet.com/en/?q=network"
            >here</a
          >.
        </div>
      </template>
    </app-modal>
    <!--
    =====================================================
      AppNetworkSettings
    =====================================================
    -->
    <app-network-settings-modal
      :close="closeGasPrice"
      :gas-price-modal="state.gasPriceModal"
      :not-enough-eth="notEnoughEth"
      :cost-in-eth="costInEth"
      :tx-fee-formatted="txFeeFormatted"
      :tx-fee-usd="feeInUsd"
      :total-gas-limit="totalGasLimit"
      @onLocalGasPrice="handleLocalGasPrice"
      @close="closeGasPrice"
    />

    <!--
    =====================================================
      Title
    =====================================================
    -->
    <div class="d-flex align-center mb-2">
      <div class="mew-heading-3 ml-4">Transaction fee</div>
    </div>

    <!--
    =====================================================
      Loader: present when loading Fee
    =====================================================
    -->
    <div v-show="gettingFee || !showFee" style="max-width: 556px">
      <v-skeleton-loader type="heading" class="mt-2 px-sm-2 align-center" />
      <v-skeleton-loader
        type="heading"
        class="mt-2 px-sm-2 align-center d-block d-sm-none"
      />
    </div>

    <v-row v-if="!gettingFee && showFee">
      <v-col cols="12">
        <!--
      =====================================================
        Transaction fee selector button
      =====================================================
      -->
        <div class="d-flex align-center justify-space-between flex-wrap mb-2">
          <div class="d-flex align-center flex-wrap flex-grow-1">
            <v-btn
              color="greyLight"
              depressed
              class="text-transform--initial"
              :disabled="error !== ''"
              @click="openGasPriceModal"
            >
              <div class="d-flex align-center">
                <div
                  :class="hasError ? 'redPrimary--text' : 'textMedium--text'"
                >
                  {{ feeInUsd }}
                </div>
                <v-icon
                  :color="hasError ? 'redPrimary' : ''"
                  small
                  class="mx-2"
                >
                  mdi-arrow-right
                </v-icon>
                <div class="d-flex align-center">
                  <v-icon :color="hasError ? 'redPrimary' : ''" small>
                    mdi-clock-outline
                  </v-icon>
                  <div :class="hasError ? 'redPrimary--text' : ''">
                    {{ timeWillTake }}
                  </div>
                </div>
                <v-icon :color="hasError ? 'redPrimary' : ''" class="ml-3">
                  mdi-chevron-down
                </v-icon>
              </div>
            </v-btn>
            <div
              :class="hasError ? 'redPrimary--text' : 'textLight--text'"
              class="ml-3 py-1"
            >
              {{ txFeeFormatted }} {{ globalStore.network.type.currencyName }}
            </div>
          </div>
          <div v-if="fromEth">
            <div class="py-2 ml-2 text-right">
              <div class="textMedium--text">
                <span class="mr-2 textMedium--text">Total:</span>
                {{ actualCostFormatted }}
                {{ globalStore.network.type.currencyName }}
              </div>
            </div>
          </div>
        </div>

        <!--
      =====================================================
        Not enough balance warning / Error
      =====================================================
      -->
        <div class="d-flex flex-wrap justify-space-between">
          <div
            v-if="!props.gettingFee && hasError"
            :class="[hasError ? 'redPrimary--text' : '']"
            class="ml-2"
          >
            {{ error }}
            <a
              v-if="notEnoughEth && globalStore.network.type.canBuy"
              @click="openMoonpay"
            >
              Buy more {{ globalStore.network.type.currencyName }}
            </a>
          </div>
          <div>
            <div
              v-if="globalStore.isEthNetwork"
              class="ml-2 greenPrimary--text cursor--pointer user-select--none"
              @click="showHighNote"
            >
              How are fees determined?
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import BigNumber from 'bignumber.js/bignumber';
import { fromWei } from 'web3-utils';

import AppNetworkSettingsModal from './AppNetworkSettingsModal.vue';
import AppModal from '@/core/components/AppModal.vue';
import {
  formatFiatValue,
  formatFloatingPointValue
} from '@/core/helpers/numberFormatHelper';
import { estimatedTime } from '@/core/helpers/gasPriceHelper';
import { computed, reactive, watch } from 'vue';
import { useExternalStore } from '@/stores/external';
import { useGlobalStore } from '@/stores/global';
import { tryOnMounted } from '@vueuse/shared';

// import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';
// import buyMore from '@/core/mixins/buyMore.mixin.js';

const emit = defineEmits(['onLocalGasPrice']);
const props = defineProps({
  showFee: {
    type: Boolean,
    default: false
  },
  gettingFee: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  txFee: {
    type: String,
    default: '0'
  },
  totalCost: {
    type: String,
    default: '0'
  },
  notEnoughEth: {
    type: Boolean,
    default: false
  },
  fromEth: {
    type: Boolean,
    default: false
  },
  totalGasLimit: {
    type: String,
    default: '0'
  },
  isSwap: {
    type: Boolean,
    default: false
  }
});

type State = {
  gasPriceModal: boolean;
  openHighFeeNote: boolean;
  interval: () => any | NodeJS.Timer;
};
const state: State = reactive({
  gasPriceModal: false,
  openHighFeeNote: false,
  interval: () => {
    return;
  }
});

const externalStore = useExternalStore();
const globalStore = useGlobalStore();
const txFeeInEth = computed(() => {
  return fromWei(props.txFee);
});
const costInEth = computed(() => {
  const cost = new BigNumber(props.totalCost).toFixed();
  return fromWei(cost);
});
const txFeeFormatted = computed(() => {
  return formatFloatingPointValue(txFeeInEth.value).value;
});
const actualCostFormatted = computed(() => {
  return formatFloatingPointValue(costInEth.value).value;
});
const feeInUsd = computed(() => {
  const value = formatFiatValue(
    BigNumber(txFeeInEth.value).times(this.fiatValue).toFixed(2),
    { currency: this.preferredCurrency }
  ).value;
  return value;
});
const hasError = computed(() => {
  return props.error !== '';
});
const timeWillTake = computed(() => {
  return estimatedTime(globalStore.gasPriceType);
});
watch(
  () => state.gasPriceModal,
  () => {
    clearInterval(state.interval);
    state.interval = setGasPriceInterval();
  }
);
watch(
  () => globalStore.gasPriceType,
  newVal => {
    if (props.isSwap) {
      //trackSwap(`swapGasSwitch: ${newVal}`);
    }
  }
);
tryOnMounted(() => {
  // update gasprice every 2 minutes
  state.interval = setGasPriceInterval();
  if (props.isSwap) {
    //trackSwap(`swapGasSwitch: ${this.gasPriceType}`);
  }
});
const setGasPriceInterval = () => {
  return setInterval(() => {
    handleLocalGasPrice(globalStore.gasPriceByType()(globalStore.gasPrice));
  }, 60 * 2000);
};
const closeGasPrice = () => {
  state.gasPriceModal = false;
};
const openGasPriceModal = () => {
  // this.updateGasPrice().then(() => {
  //   state.gasPriceModal = true;
  // });
};
const handleLocalGasPrice = val => {
  emit('onLocalGasPrice', val);
};
const showHighNote = () => {
  //trackGasSwitch('openHowGasIsEstimated');
  state.openHighFeeNote = true;
};
const closeHighFeeNote = () => {
  state.openHighFeeNote = false;
};
</script>

<style lang="scss">
.core--components--app-transaction-fee {
  .v-skeleton-loader__heading {
    width: 100% !important;
  }
}
</style>
