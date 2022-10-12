import Configs from '../configs';
import { State } from './types';

const state = (): State => ({
  localStore: true,
  tokens: {},
  paths: [],
  stateVersion: Configs.VERSION.custom,
  addressBook: [],
  hiddenTokens: {}
});

export default state;
