import express from "express";
import type { Router } from "express";
import axios from "axios";
import { JWTToken } from "../middleware/middleware";

import { key } from "../realdata/key";
import { MYkey, isDEV } from "../key";
import { selectUsernameAndId, User } from "../login_component/login_component";

import expressJoi from "@escook/express-joi";
import { VdQuserId } from "../middleware/validationForm";

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
      descs,
      gender,
      is_active,
      last_time,
      login_count,
      registration_time,
      phone_number,
      status,
      is_admin,
      user_id,
    } = (selectUsernameAndIdRes.results as User[])[0];
    res.send({
      status: 0,
      data: JSON.stringify({
        username,
        descs,
        email,
        gender,
        is_active,
        phone_number,
        last_time,
        login_count,
        registration_time,
        status,
        is_admin,
        user_id,
      }),
      message: "查询成功 " + selectUsernameAndIdRes.message,
    });
  } catch (error) {
    return res.cc(error as string);
  }
});

userRouter.get("/easyuser", expressJoi(VdQuserId), async (req, res) => {
  // 查找该用户的数据，仅提供一些基本数据，不需要token验证
  const query = req.query;
  console.log(query.user_id );

  try {
    const selectUsernameAndIdRes = await selectUsernameAndId(query.user_id as string);
    // console.log(selectUsernameAndIdRes);
    // 解构出需要的字段
    // console.log(selectUsernameAndIdRes);

    // 判断有没有用户名且唯一
    if (selectUsernameAndIdRes.status && selectUsernameAndIdRes.length !== 1) {
      // 有问题的情况
      res.cc(selectUsernameAndIdRes.message, 1, 200);
      return 0;
    }
    // 数据唯一的情况
    const {
      username,
      gender,
      descs,
      is_active,
      last_time,
      registration_time,
      user_id,
    } = (selectUsernameAndIdRes.results as User[])[0];
    res.send({
      status: 0,
      data: JSON.stringify({
        username,
        gender,
        descs,
        is_active,
        last_time,
        registration_time,
        user_id,
      }),
      message: "查询成功 " + selectUsernameAndIdRes.message,
    });
  } catch (error) {
    return res.cc(error as string);
  }
});

export default userRouter;
