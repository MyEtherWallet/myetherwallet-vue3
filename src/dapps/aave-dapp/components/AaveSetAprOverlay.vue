<template>
  <!--
  =====================================================================================
    Withdraw Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Select your interest rate"
    :close="close"
  >
    <div>
      <aave-select-interest
        :selected-token="actualToken"
        @continue="handleSetInterestRate"
      />
    </div>
  </mew-overlay>
</template>

<script setup lang="ts">
//import { Toast, WARNING } from '@/modules/toast/handler/handlerToast';
import { useWalletStore } from '@/stores/wallet';
import { reactive } from 'vue';
import { useAaveOverlay, useProps } from '../handlers/aaveOverlayMixin';
import AaveSelectInterest from './AaveSelectInterest.vue';
const { address } = useWalletStore();
const props = defineProps({ ...useProps });
const { actualToken, selectedTokenInUserSummary } = useAaveOverlay(props);
const state = reactive({
  rateType: ''
});
const handleSetInterestRate = (e: string) => {
  state.rateType = e;
  const param = {
    aavePool: 'proto',
    userAddress: address,
    reserve: actualToken.value.underlyingAsset
  };
  if (
    e.toLowerCase() ===
    selectedTokenInUserSummary.value.borrowRateMode.toLowerCase()
  ) {
    //Toast(`Selected rate is already ${e}`, {}, WARNING);
  } else {
    //this.$emit('onConfirm', param);
    props.close();
  }
};
</script>
