import gql from 'graphql-tag';

export const ReserveRatesHistoryData = gql(`
  fragment ReserveRatesHistoryData on ReserveParamsHistoryItem {
    variableBorrowRate
    stableBorrowRate
    liquidityRate
    utilizationRate
    timestamp
    __typename
  }`);

export const UserReserveData = gql(`
fragment UserReserveData on UserReserve {
  principalATokenBalance
  userBalanceIndex
  redirectedBalance
  interestRedirectionAddress
  reserve {
    id
    underlyingAsset
    name
    symbol
    decimals
    liquidityRate
    reserveLiquidationBonus
    lastUpdateTimestamp
    aToken {
      id
    }
  }
  usageAsCollateralEnabledOnUser
  borrowRate
  borrowRateMode
  originationFee
  principalBorrows
  variableBorrowIndex
  lastUpdateTimestamp
  __typename
}`);

export const ReserveData = gql(`
fragment ReserveData on Reserve {
  id
  underlyingAsset
  name
  symbol
  decimals
  isActive
  usageAsCollateralEnabled
  borrowingEnabled
  stableBorrowRateEnabled
  baseLTVasCollateral
  optimalUtilisationRate
  averageStableBorrowRate
  stableRateSlope1
  stableRateSlope2
  baseVariableBorrowRate
  variableRateSlope1
  variableRateSlope2
  liquidityIndex
  reserveLiquidationThreshold
  variableBorrowIndex
  aToken {
    id
  }
  availableLiquidity
  stableBorrowRate
  liquidityRate
  totalBorrows
  totalBorrowsStable
  totalBorrowsVariable
  totalLiquidity
  utilizationRate
  reserveLiquidationBonus
  variableBorrowRate
  price {
    priceInEth
  }
  lastUpdateTimestamp
}`);
