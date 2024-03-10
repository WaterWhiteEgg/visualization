// middleware.ts
const middleware: any = function (req, res, next) {
    // 中间件逻辑处理
    next();
  };
  
  module.exports.middleware = middleware;
  export { }