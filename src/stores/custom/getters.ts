import { useGlobalStore } from '../global';
import { State } from './types';

const customTokens = function (this: State): Array<any> {
  const network = useGlobalStore().currentNetwork;
  return this.tokens[network.type.name] || [];
};

const hasCustom = function (this: This): boolean {
  const tokens = this.customTokens();
  return tokens.length > 0;
};

interface This extends State {
  hasCustom: Function;
  customTokens: Function;
}

export default {
  customTokens,
  hasCustom
};
