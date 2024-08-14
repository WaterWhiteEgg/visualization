import express from "express";
import type { Router } from "express";
import axios from "axios";
import { JWTToken } from "../middleware/middleware";
import connection from "../db/dbmain";
import { ResultSetHeader } from "../login_component/login_component";

import { key } from "../realdata/key";
import { MYkey, isDEV, table_name } from "../key";
import { selectUsernameAndId, User } from "../login_component/login_component";

import expressJoi from "@escook/express-joi";
import { VdChangeUsername, VdQuserId,VdChangeDescs } from "../middleware/validationForm";
import { checkLoggedIn } from "../login_component/guest";

const userRouter: Router = express.Router();

// 查询用户的token，返回对应数据库的列
userRouter.get("/user", async (req, res) => {
  const tokenValue = req.auth as JWTToken;
  // console.log(tokenValue);
  // 查找该用户的数据
  try {
    const selectUsernameAndIdRes = await selectUsernameAndId(
      tokenValue.user.user_id
    );
    // console.log(tokenValue.user);
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
      is_guest,
      is_admin,
      user_id,
      avatar_url,
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
        is_guest,
        login_count,
        registration_time,
        status,
        is_admin,
        user_id,
        avatar_url,
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
  console.log(query.user_id);

  try {
    const selectUsernameAndIdRes = await selectUsernameAndId(
      query.user_id as string
    );
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
      avatar_url,
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
        avatar_url,
      }),
      message: "查询成功 " + selectUsernameAndIdRes.message,
    });
  } catch (error) {
    return res.cc(error as string);
  }
});

// 修改用户名,不允许游客登录修改
userRouter.put(
  "/change/username",checkLoggedIn,
  expressJoi(VdChangeUsername),
  async (req, res) => {
    const { user_id, username }: { user_id: string; username: string } =
      req.body;

    try {
      // 查找用户想改变的用户名
      const selectUsernameAndIdRes = await selectUsernameAndId(username);
      // console.log(selectUsernameAndIdRes);

      //  只有空的情况才能改变用户名
      if (selectUsernameAndIdRes.length !== 0) {
        res.cc("有重复的用户名");
      }

      // 更新用户名
      const updateResult = await updateUsername(username, user_id);

      res.send(updateResult);

    } 
    // 错误处理
    catch (error) {
      res.cc(error as Error);
    }
  }
);
// 更新用户名
const updateUsername = (newUsername: string, id: string) => {
  const updateQuery = `
  UPDATE ${table_name}
  SET username = ?
  WHERE user_id = ?;
`;
  console.log(newUsername, id);

  return new Promise((resolve, reject) => {
    // 尝试更新
    connection.query(
      updateQuery,
      [newUsername, id],
      function (err, updateResults) {
        // 错误处理
        if (err) {
          reject(err);
        }

        console.log(updateResults);

        // 判断是否修改成功
        if ((updateResults as ResultSetHeader).affectedRows !== 1) {
          reject({ status: 1, err: "修改失败！" });
        } else {
          resolve({
            message: "修改成功",
            status: 0,
          });
        }
      }
    );
  });
};

// 修改简介
userRouter.put(
  "/change/descs",
  expressJoi(VdChangeDescs),
  async (req, res) => {
    const {descs, user_id }: {descs:string, user_id: string } =
      req.body;

    try {
    
      // 更新简介
      const updateResult = await updateDesc(descs, user_id);

      res.send(updateResult);

    } 
    // 错误处理
    catch (error) {
      res.cc(error as Error);
    }
  }
);

// 更新简介
const updateDesc = ( newDescs:string,id: string) => {
  const updateQuery = `
  UPDATE ${table_name}
  SET descs = ?
  WHERE user_id = ?;
`;

  return new Promise((resolve, reject) => {
    // 尝试更新
    connection.query(
      updateQuery,
      [newDescs, id],
      function (err, updateResults) {
        // 错误处理
        if (err) {
          reject(err);
        }

        console.log(updateResults);

        // 判断是否修改成功
        if ((updateResults as ResultSetHeader).affectedRows !== 1) {
          reject({ status: 1, err: "修改失败！" });
        } else {
          resolve({
            message: "修改成功",
            status: 0,
          });
        }
      }
    );
  });
};
export default userRouter;
