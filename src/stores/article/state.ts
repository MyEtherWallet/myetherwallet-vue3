import Configs from '../configs';
import { State } from './types';

const state = (): State => ({
  localStore: true,
  articleStore: {},
  timestamp: new Date().getTime(),
  stateVersion: Configs.VERSION.article
});

export default state;
