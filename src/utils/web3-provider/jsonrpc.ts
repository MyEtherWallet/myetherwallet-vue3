const toPayload = (id: number, result: any) => {
  return {
    jsonrpc: '2.0',
    id,
    result
  };
};
const toError = (id: number, msg: string, code: number) => {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: code ? code : -32603,
      message: msg
    }
  };
};
export { toPayload, toError };
