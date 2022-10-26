import { useGlobalStore } from '../global';
import { PiniaGetterAdaptor } from '../types';
import { ThisStore } from './types';

const getters: PiniaGetterAdaptor<Getters, ThisStore> = {
  customTokens(): Array<any> {
    const network = useGlobalStore().currentNetwork;
    return this.tokens[network.type.name] || [];
  },
  hasCustom(): boolean {
    const tokens = this.customTokens;
    return tokens.length > 0;
  }
};

export type Getters = {
  customTokens: Array<any>;
  hasCustom: boolean;
};
export default getters;
