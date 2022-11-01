import { Web3Method } from '.';

export default <Web3Method>(async ({ payload }, res, next) => {
  if (payload.method !== 'eth_signTransaction') return next();
  res(new Error("wallet doesn't support eth_signTransaction"));
});
