import state from './state';
import actions from './actions';
import getters from './getters';
import { defineStore } from 'pinia';

export const useExternalStore = defineStore('external', {
  state,
  actions,
  getters
});
