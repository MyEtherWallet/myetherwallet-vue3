import { PiniaActionAdaptor } from '../types';
import { ThisStore } from './types';

/**
 * Sets tokens prefetched when swap module loads
 * @param Array tokens
 */
const getters: PiniaActionAdaptor<Actions, ThisStore> = {
  setSwapTokens(tokens: any) {
    this.swapTokens = tokens;
    this.prefetched = true;
  }
};

export type Actions = {
  setSwapTokens: (tokens: any) => void;
};

export default getters;
