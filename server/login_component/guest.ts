import { Request, Response, NextFunction } from "express";
import connection from "../db/dbmain";
import { DEVtable_name, isDEV } from "../key";
import { PROtable_name } from "../realdata/key";

import { User } from "./login_component";

// 判断模式更改表名
const table_name = isDEV ? DEVtable_name : PROtable_name;
// 检查token的用户是否是游客登录
export function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
  //   查询数据
  const set = `SELECT user_id 
  FROM ${table_name} 
  WHERE user_id = ? AND is_guest = 1`;

  connection.query(set, [req.auth?.user.user_id], function (error, results) {
    // 检索错误处理
    if (error) {
      res.cc(error);
    }
    //   如果有内容
    if ((results as User[]).length > 0) {
      // 用户是游客，返回错误
      res.cc("用户是游客，不允许操作", 1, 401);
    }
    // 用户不是游客
    else {
      next();
    }
  });
}
