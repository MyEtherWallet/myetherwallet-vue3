import { useWalletStore } from '@/stores/wallet';
import { Web3Method } from '.';
import { toPayload } from '../jsonrpc';
export default <Web3Method>(async ({ payload }, res, next) => {
  if (payload.method !== 'eth_coinbase') return next();
  if (!useWalletStore().instance) res(null, toPayload(payload.id, null));
  res(
    null,
    toPayload(payload.id, useWalletStore().instance.getAddressString())
  );
});
