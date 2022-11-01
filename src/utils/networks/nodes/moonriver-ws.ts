import { Node } from './types';
import { MOONRIVER } from '../types';
export default <Node>{
  type: MOONRIVER,
  service: 'moonbeam.network-ws',
  url: 'wss://wss.api.moonriver.moonbeam.network/',
  port: 443,
  auth: false,
  username: '',
  password: ''
};
