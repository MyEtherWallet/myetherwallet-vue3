import Configs from '../configs';
import { State } from './types';

const state = (): State => ({
  localStore: true,
  notifications: [],
  stateVersion: Configs.VERSION.notifications
});

export default state;
