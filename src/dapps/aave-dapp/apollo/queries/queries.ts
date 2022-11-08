//import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import Configs from '../configs';
import { useWalletStore } from '@/stores/wallet';
import {
  LiquidityRateHistoryUpdate,
  UsdPriceEth,
  UserPositionUpdateSubscription,
  ReserveUpdateSubscription
} from './aave';
import { ApolloError } from '@apollo/client/errors';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
export default class AaveCalls {
  apollo: ApolloClient<InMemoryCache>;
  address: string;
  constructor(apollo: ApolloClient<InMemoryCache>) {
    this.apollo = apollo;
    this.address = useWalletStore().address || '';
  }

  getLiquidityRateHistoryUpdate(param: string, next: (...args: any[]) => any) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: LiquidityRateHistoryUpdate,
      variables: {
        reserveAddress: param
      }
      //client: 'aave'
    });

    // Subscribe
    connector.subscribe({
      next: next,
      error: function (err: ApolloError) {
        //Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUsdPriceEth(next: (...args: any[]) => any) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: UsdPriceEth
      //client: 'aave'
    });

    // Subscribe
    connector.subscribe({
      next: next,
      error: function (err: ApolloError) {
        //Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUserData(next: (...args: any[]) => any) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: UserPositionUpdateSubscription,
      //client: 'aave',
      variables: {
        userAddress: this.address,
        poolId: Configs.POOL_ID
      }
    });

    // Subscribe
    connector.subscribe({
      next: next,
      error: function (err: ApolloError) {
        //Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getReserveData(next: (...args: any[]) => any) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: ReserveUpdateSubscription,
      variables: {
        poolId: Configs.POOL_ID
      }
      //client: 'aave'
    });

    // Subscribe
    connector.subscribe({
      next: next,
      error: function (err: ApolloError) {
        //Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }
}
