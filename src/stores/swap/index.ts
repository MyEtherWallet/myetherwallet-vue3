import state from './state';
import actions from './actions';
import { defineStore } from 'pinia';

export const useSwapStore = defineStore('Swap', {
  state,
  actions
});
