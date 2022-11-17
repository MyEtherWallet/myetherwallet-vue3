import { TinyEmitter } from 'tiny-emitter';

const emitter = new TinyEmitter();

const eventBus = {
  $on: (
    event: string,
    callback: (...args: unknown[]) => unknown,
    ctx?: unknown
  ) => emitter.on(event, callback, ctx),
  $once: (
    event: string,
    callback: (...args: unknown[]) => unknown,
    ctx?: unknown
  ) => emitter.once(event, callback, ctx),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $emit: (event: string, ...args: any[]) => emitter.emit(event, ...args),
  $off: (event: string, callback?: (...args: unknown[]) => unknown) =>
    emitter.off(event, callback)
};

export default eventBus;
