<template>
  <!--
  =====================================================================================
    Withdraw Overlay
  =====================================================================================
  -->
  <mew-overlay
    :show-overlay="open"
    title="Withdraw"
    right-btn-text="Close"
    :close="close"
  >
    <div>
      <aave-amount-form
        :selected-token="preSelectedToken"
        :handler="handler"
        :show-toggle="aaveWithdrawForm.showToggle"
        :left-side-values="aaveWithdrawForm.leftSideValues"
        :right-side-values="aaveWithdrawForm.rightSideValues"
        :form-text="aaveWithdrawForm.formText"
        :button-title="aaveWithdrawForm.buttonTitle"
        :token-balance="tokenBalance"
        @cancel="handleCancel"
        @emitValues="handleWithdrawAmount"
      />
    </div>
  </mew-overlay>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/global';
import { useWalletStore } from '@/stores/wallet';
import BigNumber from 'bignumber.js/bignumber';
import { computed } from 'vue';
import { useProps, useAaveOverlay } from '../handlers/aaveOverlayMixin';
import { convertToFixed } from '../handlers/helpers';
import AaveAmountForm from './AaveAmountForm.vue';
const { tokensList, balanceInETH, address } = useWalletStore();
const { network } = useGlobalStore();
const props = defineProps({ ...useProps });
const { actualToken, selectedTokenInUserSummary, selectedTokenUSDValue } =
  useAaveOverlay(props);

const tokenBalance = computed(() => {
  const symbol = props.preSelectedToken.token;
  if (symbol === network.type.currencyName) return balanceInETH;
  const hasBalance = tokensList.find(item => {
    if (item.symbol === symbol) {
      return item;
    }
  });
  return hasBalance ? BigNumber(hasBalance.usdBalance).toFixed() : '0';
});

const aaveWithdrawForm = computed(() => {
  const hasDeposit = selectedTokenInUserSummary.value;
  const depositedBalance = `${convertToFixed(
    hasDeposit ? hasDeposit?.currentUnderlyingBalance : 0,
    6
  )} ${props.preSelectedToken.token}`;
  const depositedBalanceInUSD = `$ ${BigNumber(selectedTokenUSDValue.value)
    .times(hasDeposit?.currentUnderlyingBalance)
    .toFixed(2)}`;
  const balance = `${tokenBalance.value} ${props.preSelectedToken.token}`;
  const usd = `$ ${BigNumber(tokenBalance.value)
    .times(selectedTokenUSDValue.value)
    .toFixed(2)}`;
  return {
    showToggle: true,
    leftSideValues: {
      title: depositedBalance,
      caption: depositedBalanceInUSD,
      subTitle: 'Aave Withdraw Balance'
    },
    rightSideValues: {
      title: balance,
      caption: usd,
      subTitle: 'Aave Wallet Balance'
    },
    formText: {
      title: 'How much would you like to withdraw?',
      caption:
        'Here you can set the amount you want to withdraw. You can manually enter a specific amount or use the percentage buttons below.'
    },
    buttonTitle: {
      action: 'Withdraw',
      cancel: 'Cancel Withdraw'
    }
  };
});

const handleWithdrawAmount = (e: string) => {
  const param = {
    aavePool: 'proto',
    amount: e,
    userAddress: address,
    aToken: actualToken.value.aToken.id
  };

  //this.$emit('onConfirm', param);
  props.close();
};

const handleCancel = () => {
  props.close();
};
</script>
