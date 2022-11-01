import { isEmpty } from 'lodash';
import BigNumber from 'bignumber.js';
import { computed, Prop } from 'vue';
interface Props {
  handler: Prop<any>;
  preSelectedToken: Prop<any>;
  open: Prop<any>;
  close: Prop<any>;
}
export const useProps: Props = {
  handler: {
    type: Object || null,
    //validator: (item: any) => typeof item === 'object' || null,
    default: () => {}
  },
  preSelectedToken: {
    default: () => {
      return {};
    },
    type: Object
  },
  open: {
    default: false,
    type: Boolean
  },
  close: {
    default: () => {},
    type: Function
  }
};

export const useAaveOverlay = (props: any) => {
  const actualSelectedToken = computed(() => {
    const selectedTokens = isEmpty(props.selectedToken)
      ? isEmpty(props.preSelectedToken)
        ? {}
        : props.preSelectedToken
      : props.selectedToken;
    return selectedTokens;
  });
  const actualToken = computed(() => {
    if (props.handler && !isEmpty(props.handler)) {
      const token = props.handler?.reservesData.find((item: any) => {
        if (item.symbol === props.actualSelectedToken.token) return item;
      });
      return token;
    }
    return {};
  });
  const selectedTokenUSDValue = computed(() => {
    return props.actualToken ? props.actualToken?.price?.priceInEth : 0;
  });
  const selectedTokenInUserSummary = computed(() => {
    return props.handler?.userSummary?.reservesData?.find((item: any) => {
      if (item.reserve.symbol === props.actualSelectedToken.token) {
        return item;
      }
    });
  });
  const amountUsd = computed(() => {
    const amount = props.amount ? props.amount : 0;
    return `$ ${BigNumber(props.selectedTokenUSDValue)
      .times(amount)
      .toFixed(2)}`;
  });
  return {
    useProps,
    actualSelectedToken,
    actualToken,
    selectedTokenUSDValue,
    selectedTokenInUserSummary,
    amountUsd
  };
};
