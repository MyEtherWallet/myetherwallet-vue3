import { buildSchema } from 'graphql';

export const LiquidityRateHistoryUpdate = buildSchema(`
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
