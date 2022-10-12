import state from './state';
import actions from './actions';
import getters from './getters';
import { defineStore } from 'pinia';

const ethBlocksTxs = defineStore('ethBlocks', {
  state,
  actions,
  getters
});

export default ethBlocksTxs;
