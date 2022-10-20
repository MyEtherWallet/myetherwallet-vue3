<template>
  <mew-overlay :show-overlay="open" :title="header" :close="callClose">
    <!--
      =====================================================================================
        Aave token borrow table
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
        :table-header="state.aaveTableHandler"
        @selectedBorrow="handleSelectedBorrow"
      />
    </v-sheet>
    <!--
      =====================================================================================
        Aave token borrow form
      =====================================================================================
      -->
    <div v-if="state.step === 1">
      <aave-amount-form
        :selected-token="state.selectedToken"
        :handler="handler"
        :action-type="state.aaveTableHandler"
        :show-toggle="aaveBorrowForm.showToggle"
        :left-side-values="aaveBorrowForm.leftSideValues"
        :right-side-values="aaveBorrowForm.rightSideValues"
        :form-text="aaveBorrowForm.formText"
        :button-title="aaveBorrowForm.buttonTitle"
        @cancelDeposit="handleCancel"
        @emitValues="handleValues"
      />
    </div>
    <!--
      =====================================================================================
        Aave select interest
      =====================================================================================
      -->
    <div v-if="state.step === 2">
      <aave-select-interest
        :selected-token="actualToken"
        @continue="handleContinue"
      />
    </div>
    <!--
      =====================================================================================
        Aave Summary
      =====================================================================================
      -->
    <div v-if="state.step === 3">
      <aave-summary
        :selected-token="state.selectedToken"
        :handler="handler"
        :amount="state.amount"
        :amount-usd="amountUsd"
        :step="state.step"
        :action-type="state.aaveTableHandler"
        @onConfirm="handleConfirm"
      />
    </div>
  </mew-overlay>
</template>

<script setup lang="ts">
import AaveTable from './AaveTable.vue';
import AaveSummary from './AaveSummary.vue';
import AaveAmountForm from './AaveAmountForm.vue';
import AaveSelectInterest from './AaveSelectInterest.vue';
import { AAVE_TABLE_HEADER, convertToFixed } from '../handlers/helpers';
import { isEmpty } from 'lodash';
import { useAaveOverlay, useProps } from '../handlers/aaveOverlayMixin';
import { computed, reactive, watch } from 'vue';
import { useWalletStore } from '@/stores/wallet';

const { selectedTokenInUserSummary, actualToken, amountUsd } = useAaveOverlay(
  {}
);
const props = defineProps({ ...useProps });

interface State {
  step: number;
  selectedToken: any;
  aaveTableHandler: string;
  amount: string;
  type: string;
}
const state: State = reactive({
  step: 0,
  selectedToken: {},
  aaveTableHandler: AAVE_TABLE_HEADER.BORROW,
  amount: '0',
  type: ''
});
const aaveBorrowForm = computed(() => {
  const hasBorrowed = selectedTokenInUserSummary.value;
  const borrowedEth = hasBorrowed
    ? `${hasBorrowed.currentBorrows} ${state.selectedToken.token}`
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
    showToggle: false,
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
      title: 'How much would you like to borrow?',
      caption: 'Here you can set the amount you want to borrow.'
    },
    buttonTitle: {
      action: 'Borrow',
      cancel: 'Cancel Borrow'
    }
  };
});
const header = computed(() => {
  switch (state.step) {
    case 1:
    case 3:
      return 'Borrow';
    case 2:
      return 'Confirmation';
    default:
      return 'Select the token you want to borrow';
  }
});
watch(props.preSelectedToken, val => {
  if (val && !isEmpty(val)) {
    handleSelectedBorrow(props.preSelectedToken);
  }
});
const handleSelectedBorrow = (e: any) => {
  state.selectedToken = e;
  state.step = 1;
};
const handleValues = (e: string) => {
  state.step = 2;
  state.amount = e;
};
const handleCancel = () => {
  callClose();
};
const callClose = () => {
  state.step = 0;
  state.selectedToken = {};
  state.aaveTableHandler = AAVE_TABLE_HEADER.BORROW;
  state.amount = '0';
  props.close();
};
const handleContinue = (e: string) => {
  state.type = e;
  state.step = 3;
};
const { address } = useWalletStore();
const handleConfirm = () => {
  const param = {
    aavePool: 'proto',
    userAddress: address,
    amount: state.amount,
    referralCode: '14',
    reserve: actualToken.value.underlyingAsset,
    interestRateMode: state.type
  };
  //this.$emit('onConfirm', param);
  callClose();
};
</script>

<style lang="scss" scoped></style>
