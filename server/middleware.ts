// middleware.ts
const middleware: any = function (req: any, res: any, next: any) {
  // 中间件逻辑处理
  next();
};

module.exports.middleware = middleware;
export {};
