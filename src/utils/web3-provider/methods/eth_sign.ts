import EventNames from '../events';
import { toPayload } from '../jsonrpc';

import { Web3Method } from '.';

import { EventBus } from '@/plugins/eventBus';
export default <Web3Method>(async ({ payload }, res, next) => {
  if (payload.method !== 'eth_sign') return next();
  const msg = payload.params[1];
  EventBus.$emit(EventNames.SHOW_MSG_CONFIRM_MODAL, msg, (_response: any) => {
    res(null, toPayload(payload.id, _response.toString('hex')));
  });
});
