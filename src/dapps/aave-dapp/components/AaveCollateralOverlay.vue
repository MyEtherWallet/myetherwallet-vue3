<template>
  <!--
  =====================================================================================
    Collateral Overlay
  =====================================================================================
  -->
  <mew-overlay :show-overlay="open" :title="title" :close="close">
    <aave-summary
      :handler="handler"
      :selected-token="preSelectedToken"
      :action-type="collateral"
      @onConfirm="callSwitchCollateral"
    />
  </mew-overlay>
</template>

<script setup lang="ts">
import AaveSummary from './AaveSummary.vue';
import { ACTION_TYPES } from '@/dapps/aave-dapp/handlers/helpers';
import { computed } from '@vue/reactivity';
import { useAaveOverlay, useProps } from '../handlers/aaveOverlayMixin';
import { useWalletStore } from '@/stores/wallet';
const collateral = ACTION_TYPES.collateral;
const props = defineProps({ ...useProps });
const {address} = useWalletStore()

const title = computed(() => {
  return Object.keys(props.preSelectedToken).length === 0
    ? ''
    : props.preSelectedToken?.toggle?.value
    ? 'Usage as collateral'
    : 'Disable usage as collateral';
});

const {actualToken} = useAaveOverlay(props)
const callSwitchCollateral = () => {
  const param = {
    aavePool: 'proto',
    userAddress: address,
    reserve: actualToken.value.underlyingAsset,
    //interestRateMode: this.type,
    usageAsCollateral: actualToken.value.usageAsCollateralEnabled
  };

  // this.$emit('onConfirm', param);
  // this.close();
};
</script>
