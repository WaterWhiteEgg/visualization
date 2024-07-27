import { Request, Response, NextFunction } from "express";
import multer from "multer";

// 自定义错误全局中间件
// 这里错误是处理在接口验证前的错误
export const globalError = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
    
  // 验证文件传输报错
  if (error instanceof multer.MulterError) {
    // Multer 发生错误
    res.status(400).send("文件上传出错：" + error.message);
  } else {
    // 其他类型的错误
    res.status(500).send("发生了错误：" + error.message);
  }
};
