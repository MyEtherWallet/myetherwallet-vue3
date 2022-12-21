import { ToastEventType } from '../types';
import ToastEvents from './toastEvents';
import * as Sentry from '@sentry/browser';
import { ToastLink } from '../types';
import { EventBus } from '@/plugins/eventBus';
import { useI18n } from 'vue-i18n';
const SUCCESS = 'success';
const ERROR = 'error';
const WARNING = 'warning';
const INFO = 'info';
const SENTRY = 'sentry';
const GLOBAL_ERRORS: Record<string, string> = {
  "Returned values aren't valid": 'errorsGlobal.invalid-returned-values',
  'Invalid message type': 'errorsGlobal.invalid-message-type',
  'Device is used in another window':
    'errorsGlobal.device-used-in-another-window',
  'wrong previous session': 'errorsGlobal.wrong-previous-session',
  'Something went wrong in mnemonic wallet access':
    'errorsGlobal.mnemonic-wallet-access-error',
  'Expected public key to be an Uint8Array with length [33, 65]':
    'errorsGlobal.invalid-public-key-needs-to-be-int8Array-with-length-33-65',
  'Returned error: insufficient funds for transfer':
    'errorsGlobal.insufficient-funds-for-transfer',
  'Promise was rejected with a falsy value':
    'errorsGlobal.promise-rejected-with-falsy-value',
  'The operation is insecure.': 'errorsGlobal.the-operation-is-insecure',
  "CONNECTION ERROR: Couldn't connect to node on WS.":
    'errorsGlobal.connection-error-couldnt-connect-to-WS',
  'Failed to fetch': 'errorsGlobal.failed-to-fetch',
  'Non-Error promise rejection captured with keys: code, message':
    'errorsGlobal.non-error-promise-rejection-captured-with-keys-code-message',
  'Network Error': 'errorsGlobal.network-error',
  'connection not open': 'errorsGlobal.connection-not-open',
  'The execution failed due to an exception. Reverted':
    'The execution failed due to an exception. Reverted',
  '_window is null': 'Device busy',
  'err: insufficient funds for gas':
    'Insufficient funds. Please make sure you have enough funds to complete a transaction',
  'invalid argument':
    'Invalid argument. Please verify that the argument provided is correct',
  'execution reverted':
    'Something went wrong with the transaction: execution reverted'
};

const GLOBAL_WARNING = {
  'ENS is not supported on network private':
    'errorsGlobal.ens-not-supported-on-network-private'
};
const foundGlobalError = (text: Error | Record<string, unknown> | string) => {
  const errorValues = Object.keys(GLOBAL_ERRORS);
  return (
    typeof text === 'string' &&
    errorValues.find(item => {
      return text.includes(item);
    })
  );
};

const foundGlobalWarning = (text: Error | string) => {
  const errorValues = Object.values(GLOBAL_WARNING);
  return (
    typeof text === 'string' &&
    errorValues.find(item => {
      return text.includes(item);
    })
  );
};
const Toast = (
  text: Error | Record<string, unknown> | string,
  link: ToastLink,
  type: ToastEventType,
  duration?: number
) => {
  const acceptableTypes = [SUCCESS, ERROR, WARNING, INFO, SENTRY];
  const { t } = useI18n();
  let extractedText: string;
  if (!type && !acceptableTypes.includes(type)) {
    EventBus.$emit(
      ToastEvents[type],
      'Provided type is empty or not valid. Please provide one of the following as type: ' +
        acceptableTypes.join(','),
      link,
      duration
    );
    return;
  }
  if (
    text instanceof Error ||
    (text && typeof text !== 'string' && Object.hasOwn(text, 'message'))
  ) {
    extractedText = text.message as string;
  } else {
    extractedText = text.toString();
  }
  if (!extractedText) {
    EventBus.$emit(
      ToastEvents[type],
      'Please provide text to display!',
      link,
      duration
    );
    return;
  }

  if (type === SENTRY) {
    if (foundGlobalError(extractedText) || foundGlobalWarning(extractedText)) {
      EventBus.$emit(
        ToastEvents[ERROR],
        t(GLOBAL_ERRORS[extractedText]),
        link,
        duration
      );
    } else {
      const errorObject = text as Record<string, unknown>;
      Sentry.captureException(
        errorObject.originalError || errorObject.error || errorObject
      );
    }
    return;
  }
  EventBus.$emit(ToastEvents[type], text, link, duration);
};

export { SUCCESS, ERROR, WARNING, INFO, Toast, SENTRY };
