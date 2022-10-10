import state from './state';
import actions from './actions';
import { defineStore } from 'pinia';

export const usePopupStore = defineStore('popups', {
  state,
  actions
});
