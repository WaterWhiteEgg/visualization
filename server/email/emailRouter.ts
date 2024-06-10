import jwt from "jsonwebtoken";
import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import crypto from "crypto";
// 表单验证
import expressJoi from "@escook/express-joi";
// 邮箱验证
import { transporter, useQQEmail } from "./index";
import { emailJoi } from "../middleware/validationForm";
const router = express.Router();

// 发送验证码
router.post("/emailCode", async (req, res) => {
  // 收集数据
  const { email }: { email: string } = req.body;
  // 生成随机验证码
  const code = generateRandomCode(8);
  console.log(code);

  // 发送验证码
  try {
    sendEmailCode(email, code);
  } catch (error) {
    // 错误处理
    res.cc(error as Error);
  }

  res.send({});
});

// 随机生成验证码
function generateRandomCode(length: number, math: boolean = false) {
  const bytes = crypto.randomBytes(length);

  // 将字节转换为十六进制字符串
  let hexString = bytes.toString("hex");

  // 首先生成随机字节
  if (math) {
    // 使用正则表达式仅保留数字字符
    hexString = hexString.replace(/\D/g, "");

    // console.log(hexString.length,hexString.length < length);

    // 长度实在不够就加一个随机值
    if (hexString.length < length) {
      const min = Math.pow(10, length - 1); // 最小值为 10^(length-1)
      const max = Math.pow(10, length) - 1; // 最大值为 10^length - 1
      // 包括最大值和最小值
      hexString =
        hexString +
        (Math.floor(Math.random() * (max - min + 1)) + min).toString();
    }

    // console.log(hexString);
  }
  // 截取所需长度
  return hexString.slice(0, length);
}

// 发送验证码处理函数
export function sendEmailCode(email: string, code: string) {
  // 创建信息表单
  const mailOptions = {
    from: useQQEmail, // 发件人邮箱地址
    to: email, // 收件人邮箱地址
    subject: "（可视化天气向你）发送验证码", // 邮件主题
    text: `你的验证码是 ${code}. 请在5分钟内进行验证，如果没有请求过，请忽略`, // 邮件正文
  };

  // 发送验证码
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      // 报错
      console.log(error);
      Promise.reject({
        status: 1,
        message: "邮箱验证失败",
      });
    }
    // 成功发送
    else {
      Promise.resolve({
        status: 0,
        message: "邮箱验证成功",
      });
    }
  });
}

// 验证邮箱格式函数
// allowUnknown - 如果为 true，则允许对象包含被忽略的未知键。 默认为 false。 // abortEarly - 当为真时，停止对第一个错误的验证，否则返回找到的所有错误。 默认为  true。
export function verifyEmail(userEmail: string) {
  return new Promise((resolve, reject) => {
    try {
      let saveEmail: string;
      // 验证
      emailJoi.validateAsync(userEmail).then((res) => {
        saveEmail = res;
        //   没有问题则返回成功
        if (saveEmail === userEmail) {
          resolve({ status: 0, email: saveEmail, message: "验证成功" });
        } else {
          reject({ status: 1, error: "未知错误。。。难道还能数据不一样的？" });
        }
      });
    } catch (error) {
      // 处理/验证失败
      //   console.log(error);
      reject({ status: 1, error });
    }
  });
}

export default router;
