import state from './state';
import actions from './actions';
import getters from './getters';
import { defineStore } from 'pinia';

export const useCustomStore = defineStore('custom', {
  state,
  actions,
  getters
});
