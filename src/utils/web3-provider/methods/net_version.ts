import { useGlobalStore } from '@/stores/global';
import { Web3Method } from '.';
import { toPayload } from '../jsonrpc';
export default <Web3Method>(async ({ payload }, res, next) => {
  if (payload.method !== 'net_version') return next();
  res(
    null,
    toPayload(
      payload.id,
      useGlobalStore().network.type.chainID?.toString() || null
    )
  );
});
