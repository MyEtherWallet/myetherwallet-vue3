import {
  depositDetails,
  borrowDetails,
  repayDetails,
  swapBorrowRateDetails,
  setUsageAsCollateralDetails,
  withdrawDetails
} from './graphQLHelpers.js';

import eth from '@/assets/images/currencies/eth.png';
import { Node } from '@/utils/networks/nodes/types';
import {
  formatUserSummaryData,
  formatReserves,
  normalize
} from '@aave/protocol-js/dist';
import moment from 'moment/moment';
import BigNumber from 'bignumber.js/bignumber';
import { useWalletStore } from '@/stores/wallet';
import { useGlobalStore } from '@/stores/global';

const STABLE_COINS = ['TUSD', 'DAI', 'USDT', 'USDC', 'sUSD'];

export default class AaveHandler {
  reservesData: Array<any>;
  rawReserveData: Array<any>;
  reservesStable: Array<any>;
  actionType: string;
  userReserveData: Array<any>;
  token: any;
  usdPriceEth: string;
  userSummary: any;
  rateHistory: RateHistory;
  // this.pendingToken = {};
  compositionDeposit: Array<any>;
  compositionBorrow: Array<any>;
  compositionCollateral: Array<any>;
  percentageLeft: string;
  isLoading: boolean;
  web3: any;
  address: string | null;
  balance: string;
  tokensList: Array<any>;
  balanceInETH: string;
  network: Node;
  constructor() {
    const { web3, address, balance, tokensList, balanceInETH } =
      useWalletStore();
    const { network } = useGlobalStore();
    this.reservesData = [];
    this.rawReserveData = [];
    this.reservesStable = [];
    this.actionType = '';
    this.userReserveData = [];
    this.token = {};
    this.usdPriceEth = '';
    this.userSummary = {};
    this.rateHistory = { labels: [], stableRates: [], variableRates: [] };
    // this.pendingToken = {};
    this.compositionDeposit = [];
    this.compositionBorrow = [];
    this.compositionCollateral = [];
    this.percentageLeft = '';
    this.isLoading = true;
    this.web3 = web3;
    this.address = address;
    this.balance = balance;
    this.tokensList = tokensList;
    this.balanceInETH = balanceInETH;
    this.network = network;
  }

  sendTransaction(param: Array<any>) {
    if (param) {
      if (param.length > 1) {
        return this.web3.mew.sendBatchTransactions(param);
      }
      return this.web3.eth.sendTransaction(param[0]);
    }
    return new Error('No Parameters sent!');
  }

  async borrow(param: any) {
    param.referralCode = '14';
    try {
      return borrowDetails(param).then(res => {
        const txArr: Array<any> = [];
        if (res.data.length !== 0) {
          res.data.borrow.forEach((data: any) => {
            txArr.push(data.tx);
          });
          return this.sendTransaction(txArr);
        }
        if (res.errors.length !== 0) {
          throw new Error(
            'You may not have enough token balance or eth to execute transaction!'
          );
        }
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async deposit(param: any) {
    try {
      return await depositDetails(param).then(res => {
        const txArr: Array<any> = [];
        if (res.data.length !== 0) {
          res.data.deposit.forEach((data: any) => {
            txArr.push(data.tx);
          });
          return this.sendTransaction(txArr);
        }
        if (res.errors.length !== 0) {
          throw new Error(
            'You may not have enough token balance or eth to execute transaction!'
          );
        }
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async withdraw(param: any) {
    try {
      return withdrawDetails(param).then(res => {
        const txArr: Array<any> = [];
        if (res.data.length !== 0) {
          res.data.redeem.forEach((data: any) => {
            txArr.push(data.tx);
          });
          return this.sendTransaction(txArr);
        }
        if (res.errors.length !== 0) {
          throw new Error(
            'You may not have enough token balance or eth to execute transaction!'
          );
        }
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async switchCollateral(param: any) {
    try {
      return setUsageAsCollateralDetails(param).then(res => {
        const txArr: Array<any> = [];
        if (res.data.length !== 0) {
          res.data.setUsageAsCollateral.forEach((data: any) => {
            txArr.push(data.tx);
          });
        }
        if (res.errors.length !== 0) {
          throw new Error(
            'You may not have enough token balance or eth to execute transaction!'
          );
        }

        return this.sendTransaction(txArr);
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async switchRate(param: any) {
    try {
      return swapBorrowRateDetails(param).then(res => {
        const txArr: Array<any> = [];
        if (res.data.length !== 0) {
          res.data.swapBorrowRateMode.forEach((data: any) => {
            txArr.push(data.tx);
          });
          return this.sendTransaction(txArr);
        }
        if (res.errors.length !== 0) {
          throw new Error(
            'You may not have enough token balance or eth to execute transaction!'
          );
        }
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  async repay(param: any) {
    try {
      return repayDetails(param).then(res => {
        const txArr: Array<any> = [];
        if (res.data.length !== 0) {
          res.data.repay.forEach((data: any) => {
            txArr.push(data.tx);
          });
          return this.sendTransaction(txArr);
        }
        if (res.errors.length !== 0) {
          throw new Error(
            'You may not have enough token balance or eth to execute transaction!'
          );
        }
      });
    } catch (e: any) {
      throw new Error(e);
    }
  }

  // aave calls

  getLiquidityRateHistoryUpdate(id: any, next: Function) {
    //this.aaveCalls.getLiquidityRateHistoryUpdate(id, next);
  }

  // setters (?)

  setFormatUserSummaryData() {
    if (
      this.reservesData.length > 0 &&
      this.userReserveData &&
      this.usdPriceEth
    ) {
      // this.userSummary = formatUserSummaryData(
      //   this.rawReserveData,
      //   this.userReserveData,
      //   this.address?.toLowerCase() || '',
      //   this.usdPriceEth,
      //   Number(moment().format('X'))
      // );
      this.mergeTheReserves();
    }
  }

  mergeTheReserves() {
    if (this.userSummary.reservesData.length > 0) {
      this.userSummary.reservesData.forEach((data: any) => {
        const foundReserve = this.reservesData.find(
          elem => elem.name === data.reserve.name
        );
        foundReserve.user = data;
      });
    }
    this.getReserveBalances();
  }

  getReserveBalances() {
    const tokensList = this.tokensList;
    const ethBalance = this.balanceInETH;
    if (this.reservesData.length > 0) {
      this.reservesData.forEach(reserve => {
        reserve.tokenBalance = 0;
        reserve.user = !reserve.user ? {} : reserve.user;
        if (reserve.symbol === 'ETH') {
          reserve.tokenBalance = ethBalance;
        }

        const foundReserve = tokensList.find(
          elem => elem.symbol === reserve.symbol
        );
        if (foundReserve) {
          reserve.tokenBalance = foundReserve.balance;
        }

        if (this.reservesStable.length < 5) {
          if (STABLE_COINS.findIndex(coin => coin === reserve.symbol) >= 0) {
            this.reservesStable.push(reserve);
          }
        }
      });
    }
    this.isLoading = false;
  }

  _liquidityRateHandler(res: any) {
    const data = res.data.userReserves;
    const rateHistory: RateHistory = {
      labels: [],
      stableRates: [],
      variableRates: []
    };
    const rayDecimals = 27;
    const sortedData = data.sort((a: any, b: any) => a.timestamp - b.timestamp);
    sortedData.forEach((item: any) => {
      const date = moment.unix(item.timestamp).format('MMM Do') || '';
      rateHistory.labels.push(date);
      rateHistory.stableRates.push(
        new BigNumber(normalize(item.stableBorrowRate, rayDecimals))
          .times(100)
          .toFixed(2)
      );
      rateHistory.variableRates.push(
        new BigNumber(normalize(item.variableBorrowRate, rayDecimals))
          .times(100)
          .toFixed(2)
      );
    });

    this.rateHistory = rateHistory;
  }

  _usdPriceHandler(res: any) {
    const data = res.data.priceOracle.usdPriceEth;
    this.usdPriceEth = data;
    this.setFormatUserSummaryData();
  }

  _userDataHandler(res: any) {
    const data = res.data.userReserves.map((item: any) => {
      item.reserve['icon'] = this.getTokenIcon();
      return item;
    });
    this.userReserveData = data;
    this.setFormatUserSummaryData();
  }

  _reserveDataHandler(res: any) {
    const data = res.data.reserves.map((item: any) => {
      item['icon'] = this.getTokenIcon();
      return item;
    });
    this.rawReserveData = data;
    this.reservesData = formatReserves(data).reverse();
    this.setFormatUserSummaryData();
  }
  /**
   * finds token from network list
   * or masterfile and uses the icon found
   */
  getTokenIcon() {
    return eth;
  }
}
interface RateHistory {
  labels: Array<any>;
  stableRates: Array<any>;
  variableRates: Array<any>;
}
