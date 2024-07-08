// eslint-disable-next-line @typescript-eslint/no-unused-vars
import express from "express";
import { JWTToken } from "../middleware/middleware";

// 添加自定义方法到 Express 的 Response 接口
declare global {
  namespace Express {
    interface Response {
      cc: (err: Error | string, status?: number, HTMLstatus = 500) => void;
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      auth?: JWTToken;
    }
  }
}