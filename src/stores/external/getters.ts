import { PiniaGetterAdaptor } from './../types';
import BigNumber from 'bignumber.js';
import platformList from '@/_generated/platformlist.json';
import {
  formatFiatValue,
  formatPercentageValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import { ThisStore } from './types';
import { useWalletStore } from '../wallet';
import { useGlobalStore } from '../global';
const getters: PiniaGetterAdaptor<Getters, ThisStore> = {
  /**
   * Get Eth Fiat value
   */
  fiatValue() {
    const tokenUSDValue = this.networkTokenUSDMarket.value;
    return new BigNumber(tokenUSDValue);
  },

  /**
   * Get Eth Balance Fiat value
   */
  balanceFiatValue() {
    const { balanceInETH } = useWalletStore();
    return new BigNumber(balanceInETH).times(this.fiatValue);
  },
  totalTokenFiatValue(): BigNumber | number {
    const { tokensList } = useWalletStore();
    if (!tokensList.length) return new BigNumber(0);
    const totalValue = tokensList.reduce(
      (total: number | string, currentVal: any) => {
        const balance =
          currentVal.usdBalance !== null &&
          (currentVal.price_change_percentage_24h !== null ||
            currentVal.market_cap !== 0)
            ? currentVal.usdBalance
            : 0;
        return new BigNumber(total).plus(balance);
      },
      0
    );
    return totalValue;
  },

  /**
   * Get main currency market info
   */
  networkTokenUSDMarket() {
    const { network } = useGlobalStore();
    const cgid = network.type.coingeckoID;
    if (cgid) {
      const token = this.coinGeckoTokens.get(cgid);
      if (token)
        return {
          value: token.current_price,
          symbol: '$',
          name: 'USD',
          price_change_percentage_24h: token.price_change_percentage_24h
        };
    }
    return {
      value: 0,
      symbol: '$',
      name: 'USD',
      price_change_percentage_24h: 0
    };
  },
  getCoinGeckoTokenById() {
    return () => (cgid: any) => {
      const cgToken = this.coinGeckoTokens.get(cgid);
      return {
        name: cgToken ? cgToken.symbol.toUpperCase() : '',
        symbol: cgToken ? cgToken.symbol.toUpperCase() : '',
        subtext: cgToken ? cgToken.name : '',
        value: cgToken ? cgToken.name : '',
        img: cgToken ? `https://img.mewapi.io/?image=${cgToken.image}` : '',
        market_cap: cgToken ? cgToken.market_cap : '0',
        market_capf: cgToken
          ? formatIntegerValue(cgToken.market_cap).value
          : '0',
        price_change_percentage_24h: cgToken
          ? cgToken.price_change_percentage_24h
          : '0',
        price_change_percentage_24hf:
          cgToken && cgToken.price_change_percentage_24h
            ? formatPercentageValue(cgToken.price_change_percentage_24h).value
            : '0',
        price: cgToken ? cgToken.current_price : '0',
        pricef: cgToken ? formatFiatValue(cgToken.current_price).value : '0'
      };
    };
  },
  /**
   * Get Token info including market data if exists
   */
  contractToToken() {
    return () =>
      (contractAddress: string): null | ContractToTokenResponse => {
        if (!contractAddress) {
          return null;
        }
        contractAddress = contractAddress.toLowerCase();
        let tokenId = platformList[contractAddress];
        let cgToken;
        if (contractAddress === MAIN_TOKEN_ADDRESS) {
          const { network } = useGlobalStore();
          tokenId = network.type.coingeckoID;
          const networkType = network.type;
          cgToken = this.getCoinGeckoTokenById(tokenId);
          return Object.assign(cgToken, {
            name: networkType.currencyName,
            symbol: networkType.currencyName,
            subtext: networkType.name_long,
            value: networkType.name_long,
            contract: MAIN_TOKEN_ADDRESS,
            img: cgToken.img !== '' ? cgToken.img : networkType.icon,
            decimals: 18
          });
        }

        cgToken = this.getCoinGeckoTokenById(tokenId);
        const networkToken = this.networkTokens.get(contractAddress);

        if (!networkToken) return null;
        return Object.assign(cgToken, {
          name: networkToken.name,
          symbol: networkToken.symbol,
          subtext: networkToken.name,
          value: networkToken.name,
          contract: networkToken.address,
          img: networkToken.icon_png ? networkToken.icon_png : '',
          decimals: networkToken.decimals
        });
      };
  }
};

interface CoinGeckoToken {
  name: string;
  symbol: string;
  subtext: string;
  value: string;
  img: string;
  market_cap: string;
  market_capf: string;
  price_change_percentage_24h: string;
  price_change_percentage_24hf: string | any;
  price: string;
  pricef: string;
}

interface ContractToTokenResponse extends CoinGeckoToken {
  name: string;
  symbol: string;
  subtext: string;
  value: string;
  contract: string;
  img: string;
  decimals: number;
}

export type Getters = {
  fiatValue: BigNumber;
  balanceFiatValue: BigNumber;
  contractToToken: () => (
    contractAddress: string
  ) => ContractToTokenResponse | null;
  networkTokenUSDMarket: {
    value: any;
    symbol: string;
    name: string;
    price_change_percentage_24h: any;
  };
  totalTokenFiatValue: number | BigNumber;
  getCoinGeckoTokenById: () => (cgid: any) => CoinGeckoToken;
};

export default getters;
