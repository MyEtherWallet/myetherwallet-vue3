//import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import {
  UsdPriceEth,
  UserPositionUpdateSubscription,
  ReserveUpdateSubscription
} from './aave.graphql';
import Configs from '../configs';
import ApolloClient, { ApolloError } from 'apollo-client';
import { useWalletStore } from '@/stores/wallet';
import { LiquidityRateHistoryUpdate } from './aave';
export default class AaveCalls {
  address: string;
  constructor(apollo) {
    this.apollo = apollo;
    this.address = useWalletStore().address || '';
  }

  getLiquidityRateHistoryUpdate(param, next) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: LiquidityRateHistoryUpdate,
      variables: {
        reserveAddress: param
      },
      client: 'aave'
    });

    // Subscribe
    connector.subscribe({
      next: next,
      error: function (err: ApolloError) {
        //Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUsdPriceEth(next) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: UsdPriceEth,
      client: 'aave'
    });

    // Subscribe
    connector.subscribe({
      next: next,
      error: function (err: ApolloError) {
        //Toast(err.message ? err.message : err, {}, ERROR);
      }
    });
  }

  getUserData(next) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: UserPositionUpdateSubscription,
      client: 'aave',
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

  getReserveData(next) {
    // Create subscription
    const connector = this.apollo.subscribe({
      query: ReserveUpdateSubscription,
      variables: {
        poolId: Configs.POOL_ID
      },
      client: 'aave'
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
