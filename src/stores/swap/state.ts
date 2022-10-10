import { State } from './types';

const state = (): State => ({
  localStore: false,
  prefetched: false,
  swapTokens: []
});

export default state;
