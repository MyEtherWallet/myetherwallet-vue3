import { isObject } from 'lodash';
const errors: Errors = {
  'transaction underpriced':
    'Current network is busy. Please try again with a higher priority.',
  'nonce too low': 'Nonce too low.',
  "reading 'message'": undefined,
  falsy: undefined,
  Popup: 'Transaction cancelled'
};
const toastErrors: Errors = { Popup: undefined };
/**
 * @param {Object | String} err
 * @returns {String} Error Message
 */
const handleError = (err: any, toast = false) => {
  const errorValues = Object.keys(toast ? toastErrors : errors);
  const message =
    err && err.message
      ? isObject(err.message)
        ? err.message.message
        : err.message
      : err;
  if (!message) return '';
  const foundError = errorValues.find(item => message.includes(item));
  return foundError
    ? toast
      ? toastErrors[foundError]
      : errors[foundError]
    : message;
};

export default handleError;

type Errors = {
  [key: string]: string | undefined;
};
