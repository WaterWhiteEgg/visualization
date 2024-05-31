import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// 中间件：验证用户输入
// string()匹配字符,number()匹配数字,regex()加入正则,required()不能为空,min()max()最大/最小长度

const name = Joi.string()
  .min(3)
  .max(12)
  .regex(/^[^\s~!@#$%^&*()_+`\-={}[\]:;"'<>,.?/]+$/)
  .required();

const againPassword = Joi.string()
  .min(6)
  .max(18)
  .regex(/^(?=.*[0-9])(?=.*[a-zA-Z])[\da-zA-Z!@#$%^&*()+=\\[\]{}|:;"'<>,.?/]{6,18}$/)
  .required();

const email = Joi.string()
  .email()
  .regex(/^[\w-.]+@(qq|163|gmail)\.com$/);

const emailCode = Joi.string().regex(/^[a-zA-Z0-9]{8}$/);

const phone = Joi.string().regex(/^1[3-9]\d{9}$/);

const phoneCode = Joi.string().regex(/^\d{6}$/);

// 注册表单验证
export const VdRegister = {
  body: {
    name,
    againPassword,
  },
};