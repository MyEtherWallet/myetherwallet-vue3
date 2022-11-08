//import { Toast, SENTRY } from '@/modules/toast/handler/handlerToast';
import { errors } from 'web3-core-helpers';
import { isArray, isFunction } from 'lodash';
const Ws = function (url: string, protocols: string | Array<string>) {
  if (protocols) return new window.WebSocket(url, protocols);
  return new window.WebSocket(url);
};
const _btoa = btoa;
const parseURL = function (url: string) {
  return new URL(url);
};
export interface WSProviderType {
  responseCallbacks: any;
  notificationCallbacks: Array<any>;
  _customTimeout?: number;
  connection: WebSocket;
  addDefaultEvents: () => void;
  _parseResponse: (data: any) => Array<any>;
  _addResponseCallback: (
    payload: any,
    callback: (...args: any[]) => any
  ) => void;
  _timeout: () => void;
  send?: (payload: any, callback: (...args: any[]) => any) => void;
  on: (type: string, callback: (...args: any[]) => any) => void;
  removeListener: (type: string, callback: (...args: any[]) => any) => void;
  removeAllListeners: (type: string) => void;
  reset: () => void;
  disconnect: () => void;
  request?: (...args: any[]) => any;
}
interface WSProviderConstructor {
  new (host: string, options?: any): WSProviderType;
}
const WebsocketProvider = function WebsocketProvider(
  this: WSProviderType,
  url: string,
  options?: any
) {
  this.responseCallbacks = {};
  this.notificationCallbacks = [];

  options = options || {};
  this._customTimeout = options.timeout;
  const parsedURL = parseURL(url);
  const headers = options.headers || {};
  const protocol = options.protocol || undefined;
  if (parsedURL.username && parsedURL.password) {
    headers.authorization =
      'Basic ' + _btoa(parsedURL.username + ':' + parsedURL.password);
  }
  const clientConfig = options.clientConfig || undefined;
  // if (parsedURL.auth) {
  //   headers.authorization = 'Basic ' + _btoa(parsedURL.auth);
  // }
  this.connection = Ws(
    url,
    protocol
    // undefined,
    // headers,
    // undefined,
    // clientConfig
  );

  this.addDefaultEvents();
  this.connection.onmessage = function (this: any, e) {
    const data = typeof e.data === 'string' ? e.data : '';
    this._parseResponse(data).forEach(function (this: any, result: any) {
      let id = null;
      if (isArray(result)) {
        result.forEach(function (this: any, load: any) {
          if (this.responseCallbacks[load.id]) id = load.id;
        });
      } else {
        id = result.id;
      }
      if (
        !id &&
        result &&
        result.method &&
        result.method.indexOf('_subscription') !== -1
      ) {
        this.notificationCallbacks.forEach(function (callback: any) {
          if (isFunction(callback)) callback(result);
        });
      } else if (this.responseCallbacks[id]) {
        this.responseCallbacks[id](null, result);
        delete this.responseCallbacks[id];
      }
    });
  };
  Object.defineProperty(this, 'connected', {
    get: function () {
      return (
        this.connection && this.connection.readyState === this.connection.OPEN
      );
    },
    set: function () {
      return;
    },
    enumerable: true
  });
} as any as WSProviderConstructor;

WebsocketProvider.prototype.addDefaultEvents = function () {
  this.connection.onerror = function () {
    this._timeout();
  };
  this.connection.onclose = function () {
    this._timeout();
    this.reset();
  };
};

WebsocketProvider.prototype._parseResponse = function (data: any) {
  const returnValues: Array<any> = [];
  const dechunkedData = data
    .replace(/\}[\n\r]?\{/g, '}|--|{') // }{
    .replace(/\}\][\n\r]?\[\{/g, '}]|--|[{') // }][{
    .replace(/\}[\n\r]?\[\{/g, '}|--|[{') // }[{
    .replace(/\}\][\n\r]?\{/g, '}]|--|{') // }]{
    .split('|--|');

  dechunkedData.forEach(function (this: any, data: any) {
    if (this.lastChunk) data = this.lastChunk + data;
    let result = null;
    try {
      result = JSON.parse(data);
    } catch (e) {
      this.lastChunk = data;
      clearTimeout(this.lastChunkTimeout);
      this.lastChunkTimeout = setTimeout(function (this: any) {
        this._timeout();
        throw errors.InvalidResponse(data);
      }, 1000 * 15);

      return;
    }
    clearTimeout(this.lastChunkTimeout);
    this.lastChunk = null;

    if (result) returnValues.push(result);
  });

  return returnValues;
};

WebsocketProvider.prototype._addResponseCallback = function (
  payload: any,
  callback: (...args: any[]) => any
) {
  const id = payload.id || payload[0].id;
  const method = payload.method || payload[0].method;

  this.responseCallbacks[id] = callback;
  this.responseCallbacks[id].method = method;

  if (this._customTimeout) {
    setTimeout(function (this: any) {
      if (this.responseCallbacks[id]) {
        this.responseCallbacks[id](
          errors.ConnectionTimeout(this._customTimeout)
        );
        delete this.responseCallbacks[id];
      }
    }, this._customTimeout);
  }
};
WebsocketProvider.prototype._timeout = function () {
  for (const key in this.responseCallbacks) {
    if (this.responseCallbacks.key) {
      this.responseCallbacks[key](errors.InvalidConnection('on WS'));
      delete this.responseCallbacks[key];
    }
  }
};
WebsocketProvider.prototype.send = function (
  payload: any,
  callback: (...args: any[]) => any
) {
  if (this.connection.readyState === this.connection.CONNECTING) {
    setTimeout(function (this: any) {
      this.send(payload, callback);
    }, 10);
    return;
  }
  if (this.connection.readyState !== this.connection.OPEN) {
    //Toast('connection not open', {}, SENTRY);
    return;
  }

  this.connection.send(JSON.stringify(payload));
  this._addResponseCallback(payload, callback);
};
WebsocketProvider.prototype.on = function (
  type: string,
  callback: (...args: any[]) => any
) {
  if (typeof callback !== 'function')
    throw new Error('The second parameter callback must be a function.');

  switch (type) {
    case 'message':
      this.notificationCallbacks.push((resp: any) =>
        callback({ data: resp.params, type: resp.method })
      );
      break;

    case 'data':
      this.notificationCallbacks.push(callback);
      break;

    case 'connect':
      this.connection.onopen = callback;
      break;

    case 'end':
      this.connection.onclose = callback;
      break;

    case 'error':
      this.connection.onerror = callback;
      break;
  }
};
WebsocketProvider.prototype.removeListener = function (
  type: string,
  callback: (...args: any[]) => any
) {
  switch (type) {
    case 'data':
      this.notificationCallbacks.forEach(function (
        this: any,
        cb: (...args: any[]) => any,
        index: number
      ) {
        if (cb === callback) this.notificationCallbacks.splice(index, 1);
      });
      break;
  }
};
WebsocketProvider.prototype.removeAllListeners = function (type: string) {
  switch (type) {
    case 'data':
      this.notificationCallbacks = [];
      break;
    case 'connect':
      this.connection.onopen = null;
      break;

    case 'end':
      this.connection.onclose = null;
      break;

    case 'error':
      this.connection.onerror = null;
      break;

    default:
      break;
  }
};

WebsocketProvider.prototype.reset = function () {
  this._timeout();
  this.notificationCallbacks = [];
  this.addDefaultEvents();
};

WebsocketProvider.prototype.disconnect = function () {
  if (this.connection) {
    this.connection.close();
  }
};

export default WebsocketProvider;
