class Middleware {
  middlewares: Array<() => void>;
  constructor() {
    this.middlewares = [];
  }
  use(fn: (...args: any[]) => void) {
    this.middlewares.push(fn);
  }
  executeMiddleware(req: any, res: any, done: any) {
    this.middlewares.reduceRight(
      (done, next: (...args: any[]) => void) => () => next(req, res, done),
      done
    )(req, res);
  }
  run(req: any, res: any) {
    return new Promise(resolve => {
      this.executeMiddleware(req, res, resolve);
    });
  }
}
export default Middleware;
