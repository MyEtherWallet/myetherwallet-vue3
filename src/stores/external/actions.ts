//import { useCustomStore } from './../custom/index';
//import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
import { ETH, BSC, MATIC } from '@/utils/networks/types';
import { MAIN_TOKEN_ADDRESS } from '@/core/helpers/common';
import BigNumber from 'bignumber.js/bignumber';
import {
  formatFiatValue,
  formatFloatingPointValue,
  formatIntegerValue
} from '@/core/helpers/numberFormatHelper';
import { toBN } from 'web3-utils/types';
import getTokenInfo from '@/core/helpers/tokenInfo';
import { ThisStore } from './types';
import { useWalletStore } from '../wallet';
import { useGlobalStore } from '../global';
import { PiniaActionAdaptor } from '../types';

const actions: PiniaActionAdaptor<Actions, ThisStore> = {
  setCurrency: async function (rate: any) {
    fetch('https://mainnet.mewwallet.dev/v2/prices/exchange-rates')
      .then(res => res.json())
      .then(rates => {
        const currentRate = rates
          ? rates.find((r: any) => r.fiat_currency === rate)
          : {};
        this.currencyRate = {
          data: currentRate,
          timestamp: Date.now()
        };
      })
      .catch(e => {
        this.currencyRate = {
          data: {},
          timestamp: Date.now()
        };
        //Toast(e.message, {}, ERROR);
      });
  },
  setTokenAndEthBalance() {
    const walletStore = useWalletStore();
    const globalStore = useGlobalStore();
    //const customStore = useCustomStore();
    const address = walletStore.address;
    walletStore.loadingWalletInfo = true;
    const isTokenBalanceApiSupported =
      globalStore.network.type.name === BSC.name ||
      globalStore.network.type.name === ETH.name ||
      globalStore.network.type.name === MATIC.name;
    const TOKEN_BALANCE_API = 'https://tokenbalance.mewapi.io';

    const _getTokenBalance = (balance: string | number, decimals: number) => {
      let n: BigNumber | any = new BigNumber(balance);
      if (decimals) {
        n = n.div(new BigNumber(10).pow(decimals));
        n = formatFloatingPointValue(n);
      } else {
        n = formatIntegerValue(n);
      }
      return n;
    };
    if (!isTokenBalanceApiSupported) {
      walletStore.web3.eth.getBalance(address).then((res: any) => {
        const token = this.contractToToken(MAIN_TOKEN_ADDRESS);
        const denominator = new BigNumber(10).pow(token?.decimals || 1);
        const usdBalance = new BigNumber(res)
          .div(denominator)
          .times(token?.price || 1)
          .toString();
        walletStore.tokens = [
          Object.assign(
            {
              balance: res,
              balancef: _getTokenBalance(res, token?.decimals || 0).value,
              usdBalance: usdBalance,
              usdBalancef: formatFiatValue(usdBalance).value
            },
            token
          )
        ];
        walletStore.balance = toBN(res).toString();
        // dispatch can't be blank
        //customStore.updateCustomTokenBalances();
        walletStore.loadingWalletInfo = false;
      });
      return;
    }
    let mainTokenBalance = toBN('0');
    fetch(
      `${TOKEN_BALANCE_API}/${globalStore.network.type.name.toLowerCase()}?address=${address}`
    )
      .then(res => res.json())
      .then(res => res.result)
      .then(preTokens => {
        const hasPreTokens = preTokens ? preTokens : [];
        const promises: Array<Promise<any>> = [];

        hasPreTokens.forEach((t: any) => {
          if (!t.contract) return;
          const token = this.contractToToken(t.contract);
          if (!token) {
            promises.push(
              getTokenInfo(t.contract, walletStore.web3).then(info => {
                if (info) {
                  globalStore.network.type.tokens.push({
                    name: info.name,
                    symbol: info.symbol,
                    decimals: info.decimals,
                    address: t.contract
                  });
                }
              })
            );
          }
        });
        return Promise.all(promises).then(() => hasPreTokens);
      })
      .then(tokens => {
        const formattedList: Array<any> = [];
        tokens.forEach((t: any) => {
          const token = this.contractToToken(t.contract);
          if (!token) return;
          if (t.contract === MAIN_TOKEN_ADDRESS) {
            mainTokenBalance = toBN(t.balance);
          }
          const denominator = new BigNumber(10).pow(token.decimals);
          const usdBalance = new BigNumber(t.balance)
            .div(denominator)
            .times(token.price)
            .toString();
          formattedList.push(
            Object.assign(
              {
                balance: t.balance,
                balancef: _getTokenBalance(t.balance, token.decimals).value,
                usdBalance: usdBalance,
                usdBalancef: formatFiatValue(usdBalance).value
              },
              token
            )
          );
        });
        formattedList.sort(function (x, y) {
          return x.contract == MAIN_TOKEN_ADDRESS
            ? -1
            : y.contract == MAIN_TOKEN_ADDRESS
            ? 1
            : 0;
        });
        try {
          walletStore.tokens = formattedList;
          walletStore.balance = mainTokenBalance.toString();
          // dispatch can't be blank
          //customStore.updateCustomTokenBalances();
          walletStore.loadingWalletInfo = false;
        } catch (e) {
          //Toast(e.message, {}, ERROR));
        }
      });
  }
};

export type Actions = {
  setCurrency: (rate: any) => Promise<void>;
  setTokenAndEthBalance: () => void;
};
export default actions;
