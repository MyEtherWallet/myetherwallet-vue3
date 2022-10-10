import Configs from '../configs';
import { State } from './types';
const state = (): State => ({
  localStore: true,
  addressBookStore: [],
  isMigrated: false,
  stateVersion: Configs.VERSION.addressBook
});

export default state;
