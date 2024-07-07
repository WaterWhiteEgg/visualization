// middleware.ts
// const middleware: any = function (req: any, res: any, next: any) {
//   // 中间件逻辑处理
//   next();
// };

// 默认res，req格式
export type ResRej = {
  status: 0 | 1;
  message: string;
  data?: unknown;
};

export interface JWTToken {
  user: JWTTokenUser;
  status: JWTTokenStatus;
  iat: number;
  exp: number;
}
export interface JWTTokenUser {
  name: string;
}

export interface JWTTokenStatus {
  resource: string;
}

export {};
