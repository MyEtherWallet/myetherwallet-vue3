import { This } from './types';

/**
 * Sets tokens prefetched when swap module loads
 * @param Array tokens
 */
const setSwapTokens = function (this: This, tokens: any) {
  this.swapTokens = tokens;
  this.prefetched = true;
};

export interface Actions {
  setSwapTokens: typeof setSwapTokens;
}
export default { setSwapTokens };
