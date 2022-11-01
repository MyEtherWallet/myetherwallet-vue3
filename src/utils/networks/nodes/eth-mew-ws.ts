import { Node } from './types';
import { ETH } from '../types';
export default <Node>{
  type: ETH,
  service: 'myetherwallet.com-ws',
  url: 'wss://nodes.mewapi.io/ws/eth',
  port: 443,
  auth: false,
  username: '',
  password: ''
};
