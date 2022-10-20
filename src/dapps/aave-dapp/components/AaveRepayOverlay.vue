<template>
  <!--
  =====================================================================================
    Repay Overlay
  =====================================================================================
  -->
  <!-- <mew-overlay
    :show-overlay="open"
    title="Repay"
    :close="close"
    class="mew-component--aave-repay-overlay"
  >
    <div>
      <aave-amount-form
        :selected-token="preSelectedToken"
        :handler="handler"
        :show-toggle="aaveRepayForm.showToggle"
        :left-side-values="aaveRepayForm.leftSideValues"
        :right-side-values="aaveRepayForm.rightSideValues"
        :form-text="aaveRepayForm.formText"
        :button-title="aaveRepayForm.buttonTitle"
        :token-balance="totalBorrow"
        @cancel="handleCancel"
        @emitValues="handleRepayAmount"
      />
    </div>
  </mew-overlay> -->
</template>

<script setup lang="ts">
import { useWalletStore } from '@/stores/wallet';
import { computed, reactive } from 'vue';
import { useAaveOverlay, useProps } from '../handlers/aaveOverlayMixin';
import { convertToFixed } from '../handlers/helpers';
import AaveAmountForm from './AaveAmountForm.vue';
const props = defineProps({ ...useProps });
const state = reactive({ amount: '' });
const { selectedTokenInUserSummary, actualToken } = useAaveOverlay(props);
const totalBorrow = computed(() => {
  const borrows = selectedTokenInUserSummary.value?.currentBorrows;
  return borrows ? borrows : '0';
});
const aaveRepayForm = computed(() => {
  const hasBorrowed = selectedTokenInUserSummary.value;
  const borrowedEth = hasBorrowed
    ? `${hasBorrowed.currentBorrows} ${props.preSelectedToken.token}`
    : `$ 0.00`;
  const borrowedUSD = hasBorrowed
    ? `$ ${convertToFixed(hasBorrowed.currentBorrowsUSD, 2)}`
    : `0 ETH`;
  const eth = `${props.handler?.userSummary.totalCollateralETH} ETH`;
  const usd = `$ ${convertToFixed(
    props.handler?.userSummary.totalCollateralUSD,
    2
  )}`;
  return {
    showToggle: true,
    leftSideValues: {
      title: borrowedEth,
      caption: borrowedUSD,
      subTitle: 'You borrowed'
    },
    rightSideValues: {
      title: usd,
      caption: eth,
      subTitle: 'Total Collateral'
    },
    formText: {
      title: 'How much would you like to repay?',
      caption:
        'Here you can set the amount you want to repay. You can manually enter a specific amount or use the percentage buttons below.'
    },
    buttonTitle: {
      action: 'Repay',
      cancel: 'Cancel Repay'
    }
  };
});
const { address } = useWalletStore();
const handleRepayAmount = (e: string) => {
  const param = {
    aavePool: 'proto',
    amount: e,
    userAddress: address,
    reserve: actualToken.value.underlyingAsset
  };
  //this.$emit('onConfirm', param);
  handleCancel();
};
const handleCancel = () => {
  state.amount = '';
  props.close();
};
</script>
