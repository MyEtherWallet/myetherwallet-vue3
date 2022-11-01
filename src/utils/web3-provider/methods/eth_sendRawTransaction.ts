import { toPayload } from '../jsonrpc';
import { randomHex } from 'web3-utils';
import * as locStore from 'store';
import { Web3Method } from '.';
export default <Web3Method>(async ({ payload }, res, next) => {
  if (payload.method !== 'eth_sendRawTransaction') return next();
  const val = locStore.get('mew-testing');
  if (val) {
    res(null, toPayload(payload.id, randomHex(32)));
  } else {
    next();
  }
});
