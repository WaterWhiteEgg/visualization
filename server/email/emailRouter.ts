import jwt from "jsonwebtoken";
import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
// 表单验证
import expressJoi from "@escook/express-joi";
import { email } from "../middleware/validationForm";

const router = express.Router();

// 发送验证码
router.post("/emailCode", async (req, res) => {});

// 发送验证码处理函数

export function sendEmailCode() {
  // 将验证取决这个函数里而不是路由
  //   console.log(userEmail);
}

// 验证邮箱格式函数
// allowUnknown - 如果为 true，则允许对象包含被忽略的未知键。 默认为 false。 // abortEarly - 当为真时，停止对第一个错误的验证，否则返回找到的所有错误。 默认为  true。
export function verifyEmail(userEmail: string) {
    
  return new Promise(async (resolve, reject) => {
    try {
      const saveEmail = await email.validateAsync(userEmail);
      //   没有问题则返回成功
      if (saveEmail === userEmail) {
        resolve({ status: 0, email: saveEmail, message: "验证成功" });
      }else{
        reject({ status: 1, error:"未知错误。。。难道还能数据不一样的？" });
      }
    } catch (error) {
      // 处理/验证失败
      //   console.log(error);
      reject({ status: 1, error });
    }
  });
}

export default router;
