import { useGlobalStore } from '../global';
import { This } from './types';

const customTokens = function (this: This): Array<any> {
  const network = useGlobalStore().currentNetwork;
  return this.tokens[network.type.name] || [];
};

const hasCustom = function (this: This): boolean {
  const tokens = this.customTokens();
  return tokens.length > 0;
};
export interface Getters {
  customTokens: typeof customTokens;
  hasCustom: typeof hasCustom;
}
export default {
  customTokens,
  hasCustom
};
