import jwt from "jsonwebtoken";
import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import crypto from "crypto";

import CLIENT from "../redis/index";

// 表单验证
import expressJoi from "@escook/express-joi";
// 邮箱验证
import { transporter, useQQEmail } from "./index";
import { emailJoi, VdEmail, VdEmailCode } from "../middleware/validationForm";
import { ResRej } from "../middleware/middleware";
const router = express.Router();

// 发送验证码
router.post("/emailCode", expressJoi(VdEmail), async (req, res) => {
  // 收集数据
  const { email }: { email: string } = req.body;
  // 生成随机验证码
  const code = generateRandomCode(8);
  // console.log(code);

  // 发送验证码
  let sendEmailCodeRes = { status: 1, message: "没有数据" };
  try {
    sendEmailCodeRes = await sendEmailCode(email, code);
  } catch (error) {
    // 错误处理
    res.cc(error as Error);
  }
  // 如果status显示有问题
  if (sendEmailCodeRes.status) {
    res.cc(sendEmailCodeRes.message);
  }

  // 储存到resis并维持5分钟

  try {
    await CLIENT.setEx(email, 300, code);
  } catch (error) {
    res.cc(error as string);
  }

  res.send({
    status: 0,
    message: "建立成功",
  });
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
export function sendEmailCode(email: string, code: string): Promise<ResRej> {
  // 创建信息表单
  const mailOptions = {
    from: useQQEmail, // 发件人邮箱地址
    to: email, // 收件人邮箱地址
    subject: "（可视化天气向你）发送验证码", // 邮件主题
    text: `你的验证码是 ${code} 请在5分钟内进行验证，网络可能存在一定延时，如果没有请求过，请忽略`, // 邮件正文
  };

  // 发送验证码
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        // 报错
        console.log(error);
        reject({
          status: 1,
          message: "邮箱发送失败",
        });
      }
      // 成功发送
      else {
        resolve({
          status: 0,
          message: "邮箱发送成功",
        });
      }
    });
  });
}

// 检查验证码，接口验证
router.post("/emailCodeRes", expressJoi(VdEmailCode), async (req, res) => {
  // 收集数据
  const { emailCode, email }: { emailCode: string; email: string } = req.body;
  // 获取状态对象
  let emailRes = { status: 1, message: "没有找到对应的验证码" };

  try {
    emailRes = await verificationEmailCode(email, emailCode);
    
    // 1为验证失败,直接发送结果
    res.send({
      status: emailRes.status,
      message: emailRes.message,
    });
  } catch (error) {
    // 过程可能会出现的错误处理
    res.cc(error as Error);
  }
});

// 检查验证码
export function verificationEmailCode(
  email: string,
  code: string
): Promise<ResRej> {
  // console.log(email);
  return new Promise(async (resolve, reject) => {
    // 从redis里获取信息
    try {
      let realCode = await CLIENT.get(email);
      // 对比验证码正确性

      if (realCode === code) {
        resolve({
          status: 0,
          message: "验证成功",
        });
      } else {
        reject({
          status: 1,
          message: "验证失败",
        });
      }
    } catch (error) {
      // 其他错误
      reject({
        status: 1,
        message: error,
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
