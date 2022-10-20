<template>
  <div>
    <v-row class="align-end justify-space-between">
      <!--
      =====================================================================================
        Search Data
      =====================================================================================
      -->
      <v-col v-if="hasSearch" cols="12" sm="6">
        <!-- <mew-search placeholder="Search Token Symbol" :value="searchInput" /> -->
      </v-col>
      <!--
      =====================================================================================
        Toggle: All/Stable
      =====================================================================================
      -->
      <div v-if="hasToggle" class="align-end justify-center pa-3">
        <v-btn-toggle
          v-model="state.toggleType"
          mandatory
          active-class="textDark white--text alig-end"
        >
          <v-btn small>All</v-btn>
          <v-btn small>Stable</v-btn>
        </v-btn-toggle>
      </div>
      <!--
      =====================================================================================
        Table
      =====================================================================================
      -->
      <v-col cols="12">
        <!-- <mew-table
          :has-color="false"
          :table-headers="header"
          :table-data="listData"
          :loading="isLoading"
        /> -->
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import {
  roundNumber,
  roundPercentage,
  AAVE_TABLE_HEADER
} from '@/dapps/aave-dapp/handlers/helpers';
import BigNumber from 'bignumber.js/bignumber';
import { ROUTES_WALLET } from '@/core/configs/configRoutes';
import { computed, onMounted, reactive } from 'vue';
import { useGlobalStore } from '@/stores/global';
import { useWalletStore } from '@/stores/wallet';
import AaveHandler from '../handlers/handlerAave';
const props = defineProps({
  tableHeader: {
    type: String,
    default: AAVE_TABLE_HEADER.DEPOSIT
  },
  hasSearch: {
    type: Boolean,
    default: true
  },
  hasToggle: {
    type: Boolean,
    default: true
  },
  handler: {
    type: AaveHandler || null,
    //validator: item => typeof item === 'object' || null,
    default: () => {}
  }
});

/**
 * Method emits to the parent to open deposit token overlay
 *  Used in deposit Button within the table
 */
const onDepositClick = (newVal: any) => {
  //this.$emit('selectedDeposit', newVal);
};
/**
 * Method emits to the parent to open deposit token overlay
 *  Used in deposit Button within the table
 */
const onBorrowClick = (newVal: any) => {
  //this.$emit('selectedBorrow', newVal);
};
/**
 * Method emits to the parent to open withdraw token overlay
 *  Used in withdraw Button within the table
 */
const onWithdrawClick = (newVal: any) => {
  //this.$emit('withdrawToken', newval);
};
/**
 * Method open new tab with swap parameters
 *  Used in Swap Button within the table
 */
const onSwapClick = (newVal: any) => {
  // this.$router.push({
  //   name: ROUTES_WALLET.SWAP.NAME,
  //   query: {
  //     fromT: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  //     toT: newVal.address,
  //     amount: '1'
  //   }
  // });
};

/**
 * Method emits to the parent to open repay overlay
 * Used in Repay Button borrowed token within the table
 * Within Borrow Balance table
 */
const onRepayClick = (newVal: any) => {
  //this.$emit('repayBorrowing', newVal);
};

const state = reactive({
  searchInput: '',
  toggleType: 0,
  btnDeposit: {
    title: 'Deposit',
    btnStyle: 'background',
    colorTheme: 'greenPrimary',
    method: onDepositClick,
    disabled: false
  },
  btnSwap: {
    title: 'Swap',
    btnStyle: 'outline',
    colorTheme: 'greenPrimary',
    method: onSwapClick
  },
  btnBorrow: {
    title: 'Borrow',
    btnStyle: 'background',
    colorTheme: 'greenPrimary',
    method: onBorrowClick
  },
  btnWithdraw: {
    title: 'Withdraw',
    btnStyle: 'outline',
    colorTheme: 'greenPrimary',
    method: onWithdrawClick
  },
  btnRepay: {
    title: 'Repay',
    btnStyle: 'transparent',
    colorTheme: 'greenPrimary',
    method: onRepayClick
  },
  tableDepositHeader: [
    {
      text: 'Token',
      value: 'token',
      sortable: true,
      width: '15%'
    },
    {
      text: 'Available',
      value: 'available',
      sortable: true
    },
    {
      text: 'Deposited',
      value: 'deposited',
      sortable: true
    },
    {
      text: 'APR',
      value: 'apr',
      sortable: false,
      width: '14%'
    },
    {
      text: '',
      value: 'callToAction',
      sortable: false,
      width: '32%'
    }
  ],
  tableBorrowHeader: [
    {
      text: 'Token',
      value: 'token',
      sortable: false,
      width: '15%'
    },
    {
      text: 'Available',
      value: 'available',
      sortable: true
    },
    {
      text: 'Stable APR',
      value: 'stableApr',
      sortable: false,
      width: '15%'
    },
    {
      text: 'Variable APR',
      value: 'variableApr',
      sortable: false,
      width: '15%'
    },
    {
      text: '',
      value: 'callToAction',
      sortable: false,
      width: '32%'
    }
  ],
  tableBalanceDepositHeader: [
    {
      text: 'Token',
      value: 'token',
      sortable: false,
      filterable: false
    },
    {
      text: 'Deposited',
      value: 'balance',
      sortable: false,
      filterable: false
    },
    {
      text: 'Use as collateral',
      value: 'toggle',
      sortable: false,
      filterable: false
    },
    {
      text: '',
      value: 'callToAction',
      sortable: false,
      filterable: false,
      containsLink: true,
      width: '32%'
    }
  ],
  tableBalanceBorrowHeader: [
    {
      text: 'Token',
      value: 'token',
      sortable: false,
      filterable: false
    },
    {
      text: 'Borrowed',
      value: 'balance',
      sortable: false,
      filterable: false
    },
    {
      text: 'APR',
      value: 'apr',
      sortable: false,
      filterable: false,
      containsLink: true
    },
    {
      text: 'APR Type',
      value: 'toggle',
      sortable: false,
      filterable: false
    },
    {
      text: '',
      value: 'callToAction',
      sortable: false,
      filterable: false,
      containsLink: true,
      width: '32%'
    }
  ]
});

const { network } = useGlobalStore();
const { balanceInETH, tokensList } = useWalletStore();
const header = computed(() => {
  switch (props.tableHeader) {
    case AAVE_TABLE_HEADER.DEPOSIT:
      return state.tableDepositHeader;
    case AAVE_TABLE_HEADER.BORROW:
      return state.tableBorrowHeader;
    case AAVE_TABLE_HEADER.BALANCE_DEPOSIT:
      return state.tableBalanceDepositHeader;
    default:
      return state.tableBalanceBorrowHeader;
  }
});
/**
 * Returns true if the data has not been loaded yet
 */
const isLoading = computed(() => {
  return props.handler.isLoading;
});

const stableCoins = computed(() => {
  if (!isLoading.value) {
    const stableCoins = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];
    const reserves = list.value?.filter((item: any) => {
      if (stableCoins.includes(item.symbol)) return item;
    });
    return reserves;
  }
  return [];
});

const list = computed(() => {
  if (!isLoading.value) {
    if (
      props.tableHeader === AAVE_TABLE_HEADER.DEPOSIT ||
      props.tableHeader === AAVE_TABLE_HEADER.BORROW
    ) {
      return props.handler.reservesData;
    }
    if (props.tableHeader === AAVE_TABLE_HEADER.BALANCE_BORROW) {
      return props.handler.userSummary.reservesData.filter((item: any) =>
        new BigNumber(item.currentBorrows).gt(0)
      );
    }
    return props.handler.userSummary.reservesData.filter((item: any) => {
      return new BigNumber(item.principalATokenBalance).gt(0);
    });
  }
  return undefined;
});

/**
 * Returns formatted list of table data
 * Filters through search requests
 */
const listData = computed(() => {
  const l = list.value;
  if (!isLoading.value) {
    let list = state.toggleType ? stableCoins.value : l;
    const userReserves = props.handler.userSummary.reservesData;
    switch (props.tableHeader) {
      /**
       * Case: Aave Deposits Table used in Overlay
       */
      case AAVE_TABLE_HEADER.DEPOSIT:
        list = list.map((item: any) => {
          /* Get How much user has already deposited */
          const userDeposited = userReserves.find((uItem: any) => {
            if (uItem.reserve.symbol === item.symbol) {
              return uItem;
            }
          });

          /* Get User Balance for the item */
          const userBalance =
            item.symbol === 'ETH'
              ? balanceInETH
              : tokensList.find(balance => {
                  return item.symbol === balance.symbol;
                });
          /* If !balance or balance = 0, disable deposit button */
          const depositButton = Object.assign({}, state.btnDeposit);
          depositButton['disabled'] = userBalance
            ? BigNumber(userBalance).lte(0)
            : true;
          return {
            token: item.symbol,
            available: userBalance ? roundNumber(userBalance) : '0',
            deposited: userDeposited
              ? roundNumber(userDeposited.currentUnderlyingBalance)
              : '0',
            apr: roundPercentage(item.liquidityRate),
            tokenImg: `${item.icon}`,
            address: item.aToken.id,
            callToAction: [depositButton, state.btnSwap]
          };
        });
        break;
      /**
       * Case: Aave Borrow Table used in Overlay
       */
      case AAVE_TABLE_HEADER.BORROW:
        list = list.map((item: any) => {
          return {
            token: item.symbol,
            available: roundNumber(item.availableLiquidity),
            stableApr: item.stableBorrowRateEnabled
              ? roundPercentage(
                  new BigNumber(item.stableBorrowRate)
                    .multipliedBy(100)
                    .toString()
                )
              : '--',
            variableApr: roundPercentage(
              new BigNumber(item.variableBorrowRate)
                .multipliedBy(100)
                .toString()
            ),

            tokenImg: `${item.icon}`,
            address: item.aToken.id,
            callToAction: [state.btnBorrow]
          };
        });
        break;
      /**
       * Case: Aave Exhisting Deposits Table
       */
      case AAVE_TABLE_HEADER.BALANCE_DEPOSIT:
        list = list.map((item: any) => {
          return {
            token: item.reserve.symbol,
            tokenImg: `${item.reserve.icon}`,
            balance: [
              `${roundNumber(item.currentUnderlyingBalance)} ${
                item.reserve.symbol
              }`,
              `$${roundNumber(item.currentUnderlyingBalanceUSD)}`
            ],
            toggle: {
              color: 'secondary',
              method: onToggleClick,
              value: item.usageAsCollateralEnabledOnUser
            },
            callToAction: [state.btnDeposit, state.btnWithdraw]
          };
        });
        break;
      /**
       * Case: Aave Existing Borrowings Table
       */
      case AAVE_TABLE_HEADER.BALANCE_BORROW:
        list = list.map((item: any) => {
          const isVariable = item.borrowRateMode === 'Variable';
          const reserve = props.handler.reservesData.find((reserve: any) => {
            return reserve.symbol === item.reserve.symbol;
          });
          const enableToggle = reserve
            ? !reserve.stableBorrowRateEnabled
            : false;
          return {
            token: item.reserve.symbol,
            tokenImg: `${item.reserve.icon}`,
            balance: [
              `${roundNumber(item.currentBorrows)} ${item.reserve.symbol}`,
              `$${roundNumber(item.currentBorrowsUSD)}`
            ],
            apr: roundPercentage(
              new BigNumber(item.borrowRate).multipliedBy(100).toString()
            ),
            toggle: {
              color: isVariable ? 'greenMedium' : 'greenPrimary',
              method: onToggleAprType,
              value: isVariable,
              label: isVariable ? 'variable' : 'stable',
              disabled: enableToggle
            },
            callToAction: [state.btnBorrow, state.btnRepay]
          };
        });
        break;
      default:
        break;
    }
    return state.searchInput === null || state.searchInput === ''
      ? list
      : list.filter((item: any) => {
          if (
            item.token.toLowerCase().includes(state.searchInput.toLowerCase())
          )
            return item;
        });
  }
  return [];
});
onMounted(() => {
  /* Set Button styles to transparent for balance deposit table */
  if (
    props.tableHeader === AAVE_TABLE_HEADER.BALANCE_DEPOSIT ||
    props.tableHeader === AAVE_TABLE_HEADER.BALANCE_BORROW
  ) {
    state.btnDeposit.btnStyle = 'transparent';
    state.btnWithdraw.btnStyle = 'transparent';
    state.btnBorrow.btnStyle = 'transparent';
  }
});
/**
 * Method emits to the parent to open collateral overlay
 * Used in Toggle Button within the table
 * Within Deposit Balance table
 */
const onToggleClick = (newVal: any) => {
  //this.$emit('collateralChange', newVal);
};

const onToggleAprType = (newVal: any) => {
  //this.$emit('changeAprType', newVal);
};
</script>
