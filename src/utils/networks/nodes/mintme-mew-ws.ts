import { Node } from './types';
import { MINTME } from '../types';
export default <Node>{
  type: MINTME,
  service: 'mintme-ws',
  url: 'wss://node1.mintme.com/ws',
  port: 443,
  auth: false,
  username: '',
  password: ''
};
