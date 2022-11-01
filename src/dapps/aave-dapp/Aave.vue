<template>
  <div class="mew-component--aave">
    <the-wrapper-dapp
      :has-exit-btn="true"
      :banner-img="BG"
      :banner-text="state.topBanner"
      :tab-items="state.tabs"
      :active-tab="state.activeTab"
    >
      <template #tabContent1>
        <v-sheet
          color="transparent"
          max-width="724px"
          class="mx-auto py-6 px-2 px-md-3"
        >
          <div class="d-flex align-center justify-end">
            <div class="mr-3">Health factor</div>
            <div
              v-if="!isLoadingData"
              class="greenPrimary--text font-weight-bold mr-3"
            >
              {{ healthFactor }}
            </div>
            <v-skeleton-loader v-else width="31px" type="text" class="mr-3" />
            <mew-tooltip text="Health factor" />
          </div>
          <v-row class="mb-1 mt-2" dense>
            <v-col cols="12" md="6">
              <div class="greyLight pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Aggregated Balance</h5>
                <h3 v-if="!isLoadingData" class="">
                  $ {{ totalLiquidity.usd }}
                </h3>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />
                <div v-if="!isLoadingData" class="mt-2">
                  {{ totalLiquidity.eth }} ETH
                </div>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                </div>
                <mew-progress-bar
                  v-if="!isLoadingData"
                  class="mt-2"
                  :balance-obj="compositionPercentage"
                />
                <v-skeleton-loader
                  v-else
                  height="12px"
                  type="text"
                  class="mt-2"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div
                class="greyLight pa-5 border-radius--5px height-100 d-flex flex-column"
              >
                <div class="d-flex aling-center">
                  <h5 class="font-weight-bold mr-auto">Earnings</h5>
                  <div class="d-flex align-center">
                    <div class="d-flex align-center mr-3">
                      <div class="circle pink mr-1" />
                      APR
                    </div>
                    <div class="d-flex align-center">
                      <div class="circle lightblue mr-1" />
                      Total
                    </div>
                  </div>
                </div>

                <div class="ma-auto text-center pa-5">No data to show yet</div>
              </div>
            </v-col>
            <v-col cols="12" class="pt-md-2">
              <!-- <aave-table
                :table-header="state.depositsTableHeader"
                :handler="state.handler"
                :has-search="false"
                :has-toggle="false"
                @selectedDeposit="openDepositOverlayWithToken"
                @withdrawToken="openWithdrawOverlay"
                @collateralChange="openCollateralOverlay"
              /> -->
            </v-col>
          </v-row>

          <div class="d-flex justify-center mt-9">
            <mew-button
              title="Deposit"
              btn-size="xlarge"
              @click="openDepositOverlay"
            />
          </div>
        </v-sheet>
      </template>
      <template #tabContent2>
        <v-sheet
          color="transparent"
          max-width="724px"
          class="mx-auto py-6 px-2 px-md-3"
        >
          <div class="d-flex align-center justify-end">
            <div class="mr-3">Health factor</div>
            <div
              v-if="!isLoadingData"
              class="greenPrimary--text font-weight-bold mr-3"
            >
              {{ healthFactor }}
            </div>
            <v-skeleton-loader v-else width="31px" type="text" class="mr-3" />
            <mew-tooltip text="Health factor" />
          </div>

          <v-row class="mb-1 mt-2" dense>
            <v-col cols="12" md="6">
              <div class="greyLight pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">You Borrowed</h5>
                <h3 v-if="!isLoadingData">$ {{ totalBorrow.usd }}</h3>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />
                <div v-if="!isLoadingData" class="mt-2">
                  {{ totalBorrow.eth }} ETH
                </div>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                </div>
                <mew-progress-bar
                  v-if="!isLoadingData"
                  class="mt-2"
                  :balance-obj="borrowingsPercentage"
                />
                <v-skeleton-loader
                  v-else
                  height="12px"
                  type="text"
                  class="mt-2 mb-0"
                />
              </div>
            </v-col>
            <v-col cols="12" md="6">
              <div class="greyLight pa-5 border-radius--5px">
                <h5 class="mb-2 font-weight-bold">Your Collateral</h5>
                <h3 v-if="!isLoadingData">$ {{ totalCollateral.usd }}</h3>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />
                <div v-if="!isLoadingData" class="mt-2">
                  {{ totalCollateral.eth }} ETH
                </div>
                <v-skeleton-loader
                  v-else
                  height="20px"
                  type="text"
                  class="mt-2"
                />

                <v-divider class="my-4" />

                <div class="d-flex justify-space-between">
                  <div class="font-weight-medium">Composition</div>
                </div>
                <mew-progress-bar
                  v-if="!isLoadingData"
                  class="mt-2"
                  :balance-obj="collateralPercentage"
                />
                <v-skeleton-loader
                  v-else
                  height="12px"
                  width="30px"
                  type="text"
                />
              </div>
            </v-col>

            <v-col cols="12" class="pt-md-2">
              <div class="greyLight pa-5 loan-value-container">
                <v-row align="center">
                  <v-col cols="9">
                    <span class="mew-heading-3">Loan to Value</span>
                  </v-col>
                  <v-col cols="3">
                    <div class="d-flex justify-end align-center">
                      <span v-if="!isLoadingData" class="mew-heading-3">{{
                        loanValue
                      }}</span>
                      <v-skeleton-loader
                        v-else
                        height="19px"
                        width
                        type="text"
                        class="mt-2 mb-0"
                      />
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
            <v-col cols="12" class="pt-md-2">
              <!-- <aave-table
                :table-header="state.borrowTableHeader"
                :handler="state.handler"
                :has-search="false"
                :has-toggle="false"
                @selectedBorrow="openBorrowOverlayWithToken"
                @repayBorrowing="openRepayOverlay"
                @changeAprType="openAprTypeOverlay"
              /> -->
            </v-col>
          </v-row>
          <div class="d-flex justify-center mt-9">
            <mew-button
              title="Borrow"
              btn-size="xlarge"
              @click="openBorrowOverlay"
            />
          </div>
        </v-sheet>
      </template>
    </the-wrapper-dapp>
    <aave-deposit-overlay
      :open="state.showDepositOverlay"
      :close="closeDepositOverlay"
      :pre-selected-token="state.requestToken"
      :handler="state.handler"
      @onConfirm="callDeposit"
    />
    <aave-borrow-overlay
      :pre-selected-token="state.requestToken"
      :open="state.showBorrowOverlay"
      :close="closeBorrowOverlay"
      :handler="state.handler"
      @onConfirm="callBorrow"
    />
    <aave-collateral-overlay
      :pre-selected-token="state.requestToken"
      :handler="state.handler"
      :open="state.showCollateralOverlay"
      :close="closeCollateralOverlay"
      @onConfirm="callSwitchCollateral"
    />
    <aave-withdraw-overlay
      :pre-selected-token="state.requestToken"
      :handler="state.handler"
      :open="state.showWithdrawOverlay"
      :close="closeWithdrawOverlay"
      @onConfirm="callWithdraw"
    />
    <aave-repay-overlay
      :pre-selected-token="state.requestToken"
      :handler="state.handler"
      :open="state.showRepayOverlay"
      :close="closeRepayOverlay"
      @onConfirm="callRepay"
    />
    <aave-set-apr-overlay
      :pre-selected-token="state.requestToken"
      :handler="state.handler"
      :open="state.showAprTypeOverlay"
      :close="closeAprTypeOverlay"
      @onConfirm="callSwitchInterest"
    />
  </div>
</template>

<script setup lang="ts">
import TheWrapperDapp from '@/core/components/TheWrapperDapp.vue';
import AaveBorrowOverlay from './components/AaveBorrowOverlay.vue';
import AaveDepositOverlay from './components/AaveDepositOverlay.vue';
import AaveCollateralOverlay from './components/AaveCollateralOverlay.vue';
import AaveRepayOverlay from './components/AaveRepayOverlay.vue';
import AaveWithdrawOverlay from './components/AaveWithdrawOverlay.vue';
import AaveSetAprOverlay from './components/AaveSetAprOverlay.vue';
import BG from '@/assets/images/backgrounds/bg-unstoppable-domain.png';
import handlerAave from './handlers/handlerAave';
import AaveCalls from './apollo/queries/queries';
import BigNumber from 'bignumber.js';
import { AAVE_TABLE_HEADER } from '@/dapps/aave-dapp/handlers/helpers';
import AaveTable from './components/AaveTable.vue';
//import { ERROR, SUCCESS, Toast } from '@/modules/toast/handler/handlerToast';
import { computed, onMounted, reactive, watch } from 'vue';
import { useGlobalStore } from '@/stores/global';
import { useExternalStore } from '@/stores/external';

interface Colors {
  [key: string]: string;
}
const COLORS: Colors = {
  ENJ: 'bluePrimary',
  ETH: 'greenPrimary',
  ZRX: 'greenMedium',
  KNC: 'textDark',
  USDT: 'redPrimary',
  MKR: 'redPrimary',
  LEND: 'redPrimary',
  AAVE: 'textLight',
  DAI: 'textLight',
  SUSD: 'greyPrimary',
  LINK: 'greyMedium',
  BUSD: 'greyMedium',
  REN: 'greenPrimary',
  WBTC: 'greyMedium',
  UNI: 'redMedium',
  REP: 'greyLight',
  MANA: 'greyLight',
  BAT: 'greyLight',
  YFI: 'white',
  TUSD: 'black'
};
interface State {
  handler: null | handlerAave;
  caller: null | any;
  showDepositOverlay: boolean;
  requestToken: any;
  showBorrowOverlay: boolean;
  showWithdrawOverlay: boolean;
  showCollateralOverlay: boolean;
  showRepayOverlay: boolean;
  showAprTypeOverlay: boolean;
  activeTab: number;
  topBanner: {
    title: string;
    subtext: string;
  };
  depositsTableHeader: string;
  borrowTableHeader: string;
  tabs: Array<{ name: string }>;
}
const state: State = reactive({
  handler: null,
  caller: null,
  showDepositOverlay: false,
  requestToken: {},
  showBorrowOverlay: false,
  showWithdrawOverlay: false,
  showCollateralOverlay: false,
  showRepayOverlay: false,
  showAprTypeOverlay: false,
  activeTab: 0,
  topBanner: {
    title: 'AAVE',
    subtext:
      'Aave is an Open Source Money Market Protocol, allowing you to earn daily interest on your stablecoins. Borrow against various assets and switch interest between variable and stable rates'
  },
  depositsTableHeader: AAVE_TABLE_HEADER.BALANCE_DEPOSIT,
  borrowTableHeader: AAVE_TABLE_HEADER.BALANCE_BORROW,
  tabs: [{ name: 'Deposits' }, { name: 'Borrowings' }]
});
const { isEthNetwork } = useGlobalStore();
const { fiatValue } = useExternalStore();
const isLoadingData = computed(() => {
  if (!state.handler) true;
  return state.handler?.isLoading;
});
const loanValue = computed(() => {
  if (!state.handler) return `0%`;
  return `${BigNumber(state.handler.userSummary.currentLiquidationThreshold)
    .times(100)
    .toFixed()}%`;
});
const healthFactor = computed(() => {
  if (!state.handler) return '-';
  return BigNumber(state.handler.userSummary.healthFactor).gt(0)
    ? BigNumber(state.handler.userSummary.healthFactor).toFixed(3)
    : `-`;
});
const totalLiquidity = computed(() => {
  const eth =
    !state.handler || state.handler.userSummary.totalLiquidityETH === 'NaN'
      ? '0'
      : state.handler.userSummary.totalLiquidityETH;
  const usd =
    !state.handler || state.handler.userSummary.totalLiquidityETH === 'NaN'
      ? '0'
      : BigNumber(state.handler.userSummary.totalLiquidityETH)
          .times(fiatValue ? fiatValue : 0)
          .toFixed(2);

  return {
    eth: state.handler ? eth : '0',
    usd: state.handler ? usd : '0'
  };
});
const totalCollateral = computed(() => {
  if (!state.handler)
    return {
      eth: `0 ETH`,
      usd: `$ 0.00`
    };

  const eth = `${state.handler.userSummary.totalCollateralETH}`;
  const usd = `${BigNumber(
    state.handler.userSummary.totalCollateralUSD
  ).toFixed(2)}`;

  return {
    eth: eth,
    usd: usd
  };
});
const totalBorrow = computed(() => {
  if (!state.handler)
    return {
      eth: `0 ETH`,
      usd: `$ 0.00`
    };

  const eth = `${state.handler.userSummary.totalBorrowsETH}`;
  const usd = `${BigNumber(state.handler.userSummary.totalBorrowsUSD).toFixed(
    2
  )}`;

  return {
    eth: eth,
    usd: usd
  };
});
const compositionPercentage = computed(() => {
  if (
    state.handler &&
    state.handler.userSummary &&
    Object.keys(state.handler.userSummary).length > 0
  ) {
    const total = state.handler.userSummary.totalLiquidityETH;
    const data = state.handler.userSummary.reservesData.map((item: any) => {
      item['percentage'] = BigNumber(item.currentUnderlyingBalance)
        .times(100)
        .div(total)
        .toFixed();
      item['color'] = COLORS[item.reserve.symbol];
      return item;
    });
    const newObj = {
      total: total,
      data: data
    };

    return newObj;
  }

  return {
    total: 0,
    data: []
  };
});
const collateralPercentage = computed(() => {
  if (
    state.handler &&
    state.handler.userSummary &&
    Object.keys(state.handler.userSummary).length > 0
  ) {
    const total = state.handler.userSummary.totalCollateralETH;
    const data = state.handler.userSummary.reservesData.filter((item: any) => {
      if (
        item.usageAsCollateralEnabledOnUser &&
        item.currentUnderlyingBalanceETH > 0
      ) {
        item['percentage'] = BigNumber(item.currentUnderlyingBalance)
          .times(100)
          .div(total)
          .toFixed();
        item['color'] = COLORS[item.reserve.symbol];
        return item;
      }
    });
    const newObj = {
      total: total,
      data: data
    };

    return newObj;
  }

  return {
    total: 0,
    data: []
  };
});
const borrowingsPercentage = computed(() => {
  if (
    state.handler &&
    state.handler.userSummary &&
    Object.keys(state.handler.userSummary).length > 0
  ) {
    const borrowLimit = BigNumber(state.handler.userSummary.availableBorrowsETH)
      .plus(state.handler.userSummary.borrowLimitBorrowsETH)
      .toFixed(4);
    const percentageLeft = BigNumber(
      state.handler.userSummary.availableBorrowsETH
    )
      .times(100)
      .div(borrowLimit)
      .toFixed();
    const data = state.handler.userSummary.reservesData.filter((item: any) => {
      if (item.currentBorrowsETH > 0) {
        item['percentage'] = BigNumber(item.currentBorrowsETH)
          .times(100)
          .div(borrowLimit)
          .toFixed();
        item['color'] = COLORS[item.reserve.symbol];
        return item;
      }
    });
    if (
      BigNumber(borrowLimit).toNumber() > 0 &&
      BigNumber(percentageLeft).toNumber() > 0
    ) {
      data.push({
        symbol: 'Available',
        amount: '',
        percentage: percentageLeft,
        color: '#c7c7c7'
      });
    }
    const newObj = {
      total: borrowLimit,
      data: data
    };

    return newObj;
  }

  return {
    total: 0,
    data: []
  };
});
watch({ isEthNetwork }, newVal => {
  if (newVal) {
    setCallerAndHandler();
  } else {
    state.handler = null;
    state.caller = null;
  }
});
onMounted(() => {
  setCallerAndHandler();
});
const callDeposit = (e: any) => {
  state.handler
    ?.deposit(e)
    .then(() => {
      //Toast('Success! Your deposit will be displayed shortly', {}, SUCCESS);
    })
    .catch((e: any) => {
      //Toast(e.message, {}, ERROR);
    });
};
const callSwitchCollateral = (e: any) => {
  state.handler
    ?.switchCollateral(e)
    .then(() => {
      // Toast(
      //   'Success! Your collateral is being switched and will display shortly',
      //   {},
      //   SUCCESS
      // );
    })
    .catch((e: any) => {
      //Toast(e.message, {}, ERROR);
    });
};
const callBorrow = (e: any) => {
  state.handler
    ?.borrow(e)
    .then(() => {
      // Toast(
      //   'Success! Your borrowed token will be displayed shortly',
      //   {},
      //   SUCCESS
      // );
    })
    .catch((e: any) => {
      //Toast(e.message, {}, ERROR);
    });
};
const callWithdraw = (e: any) => {
  state.handler
    ?.withdraw(e)
    .then(() => {
      // Toast(
      //   'Success! Your borrowed token will be displayed shortly',
      //   {},
      //   SUCCESS
      // );
    })
    .catch((e: any) => {
      //Toast(e.message, {}, ERROR);
    });
};
const callRepay = (e: any) => {
  state.handler
    ?.repay(e)
    .then(() => {
      // Toast(
      //   'Success! Your borrowed token will be displayed shortly',
      //   {},
      //   SUCCESS
      // );
    })
    .catch((e: any) => {
      //Toast(e.message, {}, ERROR);
    });
};
const callSwitchInterest = (e: any) => {
  state.handler
    ?.switchRate(e)
    .then(() => {
      // Toast(
      //   'Success! Your borrowed token will be displayed shortly',
      //   {},
      //   SUCCESS
      // );
    })
    .catch((e: any) => {
      //Toast(e.message, {}, ERROR);
    });
};
const openDepositOverlayWithToken = (token: any) => {
  state.requestToken = token;
  state.showDepositOverlay = true;
};
const openBorrowOverlayWithToken = (token: any) => {
  state.requestToken = token;
  state.showBorrowOverlay = true;
};
const openDepositOverlay = () => {
  state.showDepositOverlay = true;
};
const closeDepositOverlay = () => {
  state.requestToken = {};
  state.showDepositOverlay = false;
};
const openBorrowOverlay = () => {
  state.showBorrowOverlay = true;
};
const closeBorrowOverlay = () => {
  state.requestToken = {};
  state.showBorrowOverlay = false;
};
const openWithdrawOverlay = (token: any) => {
  state.requestToken = token;
  state.showWithdrawOverlay = true;
};
const closeWithdrawOverlay = () => {
  state.requestToken = {};
  state.showWithdrawOverlay = false;
};
const openCollateralOverlay = (token: any) => {
  state.requestToken = token;
  state.showCollateralOverlay = true;
};
const closeCollateralOverlay = () => {
  state.requestToken = {};
  state.showCollateralOverlay = false;
};
const openRepayOverlay = (token: any) => {
  state.requestToken = token;
  state.showRepayOverlay = true;
};
const closeRepayOverlay = () => {
  state.requestToken = {};
  state.showRepayOverlay = false;
};
const openAprTypeOverlay = (token: any) => {
  state.requestToken = token;
  state.showAprTypeOverlay = true;
};
const closeAprTypeOverlay = () => {
  state.requestToken = {};
  state.showAprTypeOverlay = false;
};
const setCallerAndHandler = () => {
  state.handler = new handlerAave();
  //state.caller = new AaveCalls(this.$apollo);
  state.caller.getUserData((res: any) => {
    state.handler?._userDataHandler(res);
  });
  state.caller.getUsdPriceEth((res: any) => {
    state.handler?._usdPriceHandler(res);
  });
  state.caller.getReserveData((res: any) => {
    state.handler?._reserveDataHandler(res);
  });
};
</script>
<script>
export default {
  name: 'AaveDapp'
};
</script>
<style lang="scss" scoped>
.loan-value-container {
  border-radius: 5px;
}

.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.pink {
  background-color: #d989c6;
}
.lightblue {
  background-color: #6ad0d9;
}

.height-100 {
  height: 100%;
}
</style>
