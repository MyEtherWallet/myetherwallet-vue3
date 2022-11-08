import gql from 'graphql-tag';
import { ReserveData, UserReserveData } from './fragments';

export const LiquidityRateHistoryUpdate = gql(`
subscription LiquidityRateHistoryUpdate($reserveAddress: String!) { 
    reserveParamsHistoryItems(
      where: { reserve: $reserveAddress }
      first: 10
    ) {
      variableBorrowRate
      stableBorrowRate
      liquidityRate
      timestamp
    }
  }`);

export const ReserveUpdateSubscription =
  gql(`subscription ReserveUpdateSubscription($poolId: String!) {
    reserves(where: { pool: $poolId }) {
      ${ReserveData}
      __typename
    }
  }`);

export const UsdPriceEth = gql(`
subscription UsdPriceEth {
    priceOracle(id: "1") {
      usdPriceEth
    }
  }`);

export const UserPositionUpdateSubscription = gql(`
  subscription UserPositionUpdateSubscription(
    $userAddress: String!
    $poolId: String!
  ) {
    userReserves(where: { user: $userAddress, pool: $poolId }) {
      ${UserReserveData}
      __typename
    }
  }
  `);
