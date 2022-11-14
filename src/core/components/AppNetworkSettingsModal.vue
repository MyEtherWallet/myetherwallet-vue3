<template>
  <app-simple-dialog
    :value="gasPriceModal"
    width="420"
    title="Select transaction fee"
    @close="handleClose"
  >
    <settings-gas-price
      :is-swap="true"
      :buttons="gasButtons"
      :set-selected="setGas"
      :gas-price="gasPrice"
      :cost-in-eth="costInEth"
      :tx-fee-formatted="txFeeFormatted"
      :tx-fee-usd="txFeeUsd"
      :not-enough-eth="notEnoughEth"
      :total-gas-limit="totalGasLimit"
      :close-dialog="closeDialog"
      :from-settings="false"
    />
  </app-simple-dialog>
</template>

<script setup lang="ts">
import AppSimpleDialog from './AppSimpleDialog.vue';
//import gasPriceMixin from '@/modules/settings/handler/gasPriceMixin';
//import SettingsGasPrice from '@/modules/settings/components/SettingsGasPrice';
import { watch } from 'vue';
//import handlerAnalytics from '@/modules/analytics-opt-in/handlers/handlerAnalytics.mixin';

const emit = defineEmits(['onLocalGasPrice', 'close']);
const props = defineProps({
  gasPriceModal: {
    type: Boolean,
    default: false
  },
  close: {
    type: Function,
    default: () => {
      return;
    }
  },
  notEnoughEth: {
    type: Boolean,
    default: false
  },
  costInEth: {
    type: String,
    default: '0'
  },
  txFeeFormatted: {
    type: String,
    default: '0'
  },
  txFeeUsd: {
    type: String,
    default: '0'
  },
  totalGasLimit: {
    type: String,
    default: '0'
  }
});
/**
 * emit gas when modal
 * opens in case of difference
 */
watch(
  () => props.gasPriceModal,
  newVal => {
    if (newVal) {
      emit('onLocalGasPrice', gasPriceByType(gasPriceType));
    }
  }
);
/**
 * only emit new gas price
 * when modal is open
 */
watch(
  () => gasPrice,
  () => {
    if (props.gasPriceModal) {
      emit('onLocalGasPrice', gasPriceByType(gasPriceType));
    }
  }
);
/**
 * emit selected gas
 */
const setGas = value => {
  emit('onLocalGasPrice', gasPriceByType(value));
  setSelected(value);
  trackGasSwitch(`type:${gasPriceType}, gas:${props.txFeeFormatted}`);
};
const closeDialog = () => {
  props.close();
};
const handleClose = () => {
  emit('close');
};
</script>

<style></style>
