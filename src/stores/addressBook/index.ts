import { defineStore } from 'pinia';
import state from './state';
import actions from './actions';

export const useAddressBookStore = defineStore('addressBook', {
  state,
  actions
});
