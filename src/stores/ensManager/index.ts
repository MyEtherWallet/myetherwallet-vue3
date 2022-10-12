import State from './state';
import Actions from './actions';
import { defineStore } from 'pinia';

const ensManagerStore = defineStore('ensManager', {
  state: State,
  actions: Actions
});

export default ensManagerStore;
