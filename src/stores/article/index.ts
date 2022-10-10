import state from './state';
import actions from './actions';
import { defineStore } from 'pinia';

export const useArticleStore = defineStore('article', {
  state,
  actions
});
