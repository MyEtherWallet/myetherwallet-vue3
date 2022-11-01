import utils, { toBN } from 'web3-utils';
import { toPayload } from '../jsonrpc';
import EthCalls from '../web3Calls';
import * as locstore from 'store';
import sanitizeHex from '@/core/helpers/sanitizeHex';
import { Web3Method } from '.';
import { useGlobalStore } from '@/stores/global';

export default <Web3Method>(async ({ payload, requestManager }, res, next) => {
  if (payload.method !== 'eth_getTransactionCount') return next();
  const ethCalls = new EthCalls(requestManager);
  const addr = payload.params[0].toLowerCase();
  let cached: { nonce: string; timestamp: number } = {
    nonce: '',
    timestamp: 0
  };
  const globalStore = useGlobalStore();
  const storeKey = utils.sha3(`${globalStore.network.type.name}-${addr}`);
  if (!locstore.get(storeKey)) {
    cached = {
      nonce: '0x00',
      timestamp: 0
    };
    locstore.set(storeKey, cached);
  } else {
    cached = locstore.get(storeKey);
  }
  const timeDiff =
    Math.round((new Date().getTime() - cached.timestamp) / 1000) / 60;
  if (timeDiff > 1) {
    //await ethCalls.getTransactionCount(addr)
    const liveNonce = 0;
    const liveNonceBN = toBN(liveNonce);
    const cachedNonceBN = toBN(cached.nonce);
    if (timeDiff > 15) {
      cached = {
        nonce: sanitizeHex(liveNonceBN.toString(16)),
        timestamp: +new Date()
      };
    } else if (liveNonceBN.gt(cachedNonceBN)) {
      cached = {
        nonce: sanitizeHex(liveNonceBN.toString(16)),
        timestamp: +new Date()
      };
    }
    locstore.set(storeKey, cached);
  }
  res(null, toPayload(payload.id, cached.nonce));
});
