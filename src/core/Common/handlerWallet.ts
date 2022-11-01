import { useExternalStore } from '@/stores/external';
import { reactive } from 'vue';

/**
 * The Wallet View Apollo Mixin
 */
//import { getLatestPrices } from '@/apollo/queries/wallets/wallets.graphql';
//import { Toast, ERROR } from '@/modules/toast/handler/handlerToast';
interface State {
  getLatestPrices: string;
  tokensData: Map<any, any>;
}
export const withState: State = reactive({
  getLatestPrices: '',
  tokensData: new Map()
});
export const useHandlerWallet = () => {
  const externalStore = useExternalStore();
  /**
   * Apollo query to fetch latest tokens
   * also set the state for eth price
   */
  const apollo = {
    getLatestPrices: {
      //query: getLatestPrices,
      pollInterval: 600000,
      result({ data }: any) {
        withState.tokensData = new Map();
        if (data && data.getLatestPrices) {
          data.getLatestPrices.forEach((token: any) => {
            withState.tokensData.set(token.id, token);
          });
          externalStore.coinGeckoTokens = withState.tokensData;
        }
      },
      error(error: any) {
        //Toast(error.message, {}, ERROR);
      }
    }
  };
  return { apollo };
};
