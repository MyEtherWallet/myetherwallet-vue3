class Middleware {
  middlewares: Array<Function>;
  constructor() {
    this.middlewares = [];
  }
  use(fn: Function) {
    this.middlewares.push(fn);
  }
  executeMiddleware(req: any, res: any, done: any) {
    this.middlewares.reduceRight(
      (done, next) => () => next(req, res, done),
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
