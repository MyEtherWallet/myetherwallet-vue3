import { useWalletStore } from '@/stores/wallet';
import { Web3Method } from '.';
import { toPayload } from '../jsonrpc';

export default <Web3Method>(async ({ payload }, res, next) => {
  if (payload.method !== 'eth_accounts') return next();
  try {
    res(
      null,
      toPayload(payload.id, useWalletStore().instance.getAddressString())
    );
  } catch (err) {
    res(err);
  }
});
