<template>
  <mew-overlay
    :show-overlay="open"
    :title="header"
    :close="handleCancel"
    class="mew-component--aave-deposit-overlay"
  >
    <!--
      =====================================================================================
        Aave token deposit table
      =====================================================================================
      -->
    <v-sheet
      v-if="state.step === 0"
      color="white"
      max-width="650px"
      class="border-radius--10px pa-4"
    >
      <aave-table
        :handler="handler"
        :table-header="state.depositHeader"
        @selectedDeposit="handleSelectedDeposit"
      />
    </v-sheet>
    <!--
        =====================================================================================
          Aave Summary
        =====================================================================================
        -->
    <div v-if="state.step === 1 || state.step === 3">
      <aave-summary
        :selected-token="state.selectedToken"
        :handler="handler"
        :amount="state.amount"
        :amount-usd="amountUsd"
        :step="state.step"
        :action-type="state.depositHeader"
        @confirmed="handleConfirm"
        @onConfirm="emitDeposit"
      />
    </div>
    <div v-if="state.step === 2">
      <aave-amount-form
        :selected-token="state.selectedToken"
        :handler="handler"
        :show-toggle="aaveDepositForm.showToggle"
        :left-side-values="aaveDepositForm.leftSideValues"
        :right-side-values="aaveDepositForm.rightSideValues"
        :form-text="aaveDepositForm.formText"
        :button-title="aaveDepositForm.buttonTitle"
        :token-balance="tokenBalance"
        @cancel="handleCancel"
        @emitValues="handleDepositAmount"
      />
    </div>
  </mew-overlay>
</template>

<script setup lang="ts">
import AaveTable from './AaveTable.vue';
import AaveSummary from './AaveSummary.vue';
import AaveAmountForm from './AaveAmountForm.vue';
import { AAVE_TABLE_HEADER, convertToFixed } from '../handlers/helpers';
import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js/bignumber';
import { computed, reactive, watch } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import { useGlobalStore } from '@/stores/global';
import { useAaveOverlay, useProps } from '../handlers/aaveOverlayMixin';
const props = defineProps({ ...useProps });
interface State {
  step: number;
  selectedToken: any;
  amount: string;
  depositHeader: string;
}
const state: State = reactive({
  step: 0,
  selectedToken: {},
  amount: '0',
  depositHeader: AAVE_TABLE_HEADER.DEPOSIT
});
const {
  selectedTokenInUserSummary,
  selectedTokenUSDValue,
  actualToken,
  amountUsd
} = useAaveOverlay(props);
const { tokensList, balanceInETH, address } = useWalletStore();
const { network } = useGlobalStore();
const tokenBalance = computed(() => {
  const symbol = state.selectedToken.token;
  if (symbol === network.type.currencyName) return balanceInETH;
  const hasBalance = tokensList.find(item => {
    if (item.symbol === symbol) {
      return item;
    }
  });
  return hasBalance ? BigNumber(hasBalance.usdBalance).toFixed() : '0';
});
const header = computed(() => {
  switch (state.step) {
    case 1:
    case 3:
      return 'Deposit';
    case 2:
      return 'Confirmation';
    default:
      return 'Select the token you want to deposit';
  }
});
const aaveDepositForm = computed(() => {
  const hasDeposit = selectedTokenInUserSummary.value;
  const depositedBalance = `${convertToFixed(
    hasDeposit ? hasDeposit?.currentUnderlyingBalance : 0,
    6
  )} ${state.selectedToken.token}`;
  const depositedBalanceInUSD = `$ ${BigNumber(selectedTokenUSDValue.value)
    .times(hasDeposit?.currentUnderlyingBalance)
    .toFixed(2)}`;

  const balance = `${tokenBalance} ${state.selectedToken.token}`;
  const usd = `$ ${BigNumber(tokenBalance.value)
    .times(selectedTokenUSDValue.value)
    .toFixed(2)}`;
  return {
    showToggle: true,
    leftSideValues: {
      title: depositedBalance,
      caption: depositedBalanceInUSD,
      subTitle: 'Aave Deposit Balance'
    },
    rightSideValues: {
      title: balance,
      caption: usd,
      subTitle: 'Aave Wallet Balance'
    },
    formText: {
      title: 'How much would you like to deposit?',
      caption:
        'Here you can set the amount you want to deposit. You can manually enter a specific amount or use the percentage buttons below.'
    },
    buttonTitle: {
      action: 'Deposit',
      cancel: 'Cancel Deposit'
    }
  };
});
watch(props.preSelectedToken, val => {
  if (val && !isEmpty(val)) {
    handleSelectedDeposit(props.preSelectedToken);
  }
});
const handleSelectedDeposit = (val: any) => {
  state.selectedToken = val;
  state.step = 1;
};
const handleConfirm = () => {
  state.step += 1;
};
const handleDepositAmount = (e: string) => {
  state.step = 3;
  state.amount = e;
};
const handleCancel = () => {
  state.step = 0;
  state.selectedToken = {};
  state.amount = '0';
  props.close();
};
const emitDeposit = () => {
  const param = {
    aavePool: 'proto',
    userAddress: address,
    amount: state.amount,
    referralCode: '14',
    reserve: actualToken.value.underlyingAsset
  };
  //this.$emit('onConfirm', param);
  handleCancel();
};
</script>
