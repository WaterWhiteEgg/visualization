import express from "express";
import type { Router } from "express";
import axios from "axios";
import { JWTToken } from "../middleware/middleware";

import { key } from "../realdata/key";
import { MYkey, isDEV } from "../key";
import { selectUsernameAndId, User } from "../login_component/login_component";

const userRouter: Router = express.Router();

// 查询用户的token，返回对应数据库的列
userRouter.get("/user", async (req, res) => {
  const tokenValue = req.auth as JWTToken;
  // console.log(tokenValue);
  // 查找该用户的数据
  try {
    const selectUsernameAndIdRes = await selectUsernameAndId(
      tokenValue.user.name
    );
    // console.log(selectUsernameAndIdRes);
    // 解构出需要的字段
    const {
      username,
      email,
      gender,
      is_active,
      last_time,
      login_count,
      registration_time,
      status,
      user_id,
    } = (selectUsernameAndIdRes.results as User[])[0];
    res.send({
      status: 0,
      data: JSON.stringify({
        username,
        email,
        gender,
        is_active,
        last_time,
        login_count,
        registration_time,
        status,
        user_id,
      }),
      message: "查询成功 " + selectUsernameAndIdRes.message,
    });
  } catch (error) {
    return res.cc(error as string);
  }
});

export default userRouter;
