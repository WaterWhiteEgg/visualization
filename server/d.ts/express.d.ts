import express from "express";

// 添加自定义方法到 Express 的 Response 接口
declare global {
    namespace Express {
      interface Response {
        cc: (err: Error | string, status?: number) => void;
      }
    }
  }