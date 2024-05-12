import { Request, Response, NextFunction } from "express";

// 自定义错误中间件
export const error = (req: Request, res: Response, next: NextFunction) => {
  // 错误信息显示组件
  res.cc = function (err: Error | string, status = 1) {
    console.log(err instanceof Error ? err.message : err);
    res
      .status(500)
      .json({ status, error: err instanceof Error ? err.message : err });
  };
  next();
};
