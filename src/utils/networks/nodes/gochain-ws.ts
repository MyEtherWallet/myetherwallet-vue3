import { Node } from './types';
import { GO } from '../types';
export default <Node>{
  type: GO,
  service: 'gochain-ws',
  url: 'wss://rpc.gochain.io/ws',
  port: 443,
  auth: false,
  username: '',
  password: ''
};
