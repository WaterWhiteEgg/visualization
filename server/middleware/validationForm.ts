import Joi from "joi";

// 中间件：验证用户输入
// string()匹配字符,number()匹配数字,regex()加入正则,required()不能为空,min()max()最大/最小长度

export const name = Joi.string()
  .min(3)
  .max(12)
  .regex(/^[^\s~!@#$%^&*()_+`\-={}[\]:;"'<>,.?/]+$/)
  .required();

export const password = Joi.string()
  .min(6)
  .max(18)
  .regex(
    /^(?=.*[0-9])(?=.*[a-zA-Z])[\da-zA-Z!@#$%^&*()+=\\[\]{}|:;"'<>,.?/]{6,18}$/
  )
  .required();

export const againPassword = Joi.string()
  .min(6)
  .max(18)
  .regex(
    /^(?=.*[0-9])(?=.*[a-zA-Z])[\da-zA-Z!@#$%^&*()+=\\[\]{}|:;"'<>,.?/]{6,18}$/
  )
  .required();

export const emailJoi = Joi.string()
  .email()
  .regex(/^[\w-.]+@(qq|163|gmail)\.com$/);
export const emailJoiCanNull = Joi.string().allow("");

export const emailCodeJoi = Joi.string().regex(/^[a-zA-Z0-9]{8}$/);
export const emailCodeJoiCanNull = Joi.string()
  .regex(/^[a-zA-Z0-9]{8}$/)
  .allow("");

export const phone = Joi.string().regex(/^1[3-9]\d{9}$/);
export const phoneCanNull = Joi.string()
  .regex(/^1[3-9]\d{9}$/)
  .allow("");

export const phoneCode = Joi.string().regex(/^\d{6}$/);
export const phoneCodeCanNull = Joi.string()
  .regex(/^\d{6}$/)
  .allow("");

export const resource = Joi.string().allow("");

export const user_agent = Joi.string().allow("");

export const desc = Joi.string().allow("");

export const region = Joi.string().allow("");

export const validate = Joi.string().allow("");

// 注册表单验证
export const VdRegister = {
  body: {
    name,
    againPassword,
    resource,
    user_agent,
    desc,
    region,
    email: emailJoiCanNull,
    emailCode: emailCodeJoiCanNull,
    phone: phoneCanNull,
    phoneCode: phoneCodeCanNull,
    validate,
  },
};

// 登录表单验证
export const VdLogin = {
  body: {
    name,
    password,
    resource,
    user_agent,
  },
};

// 用户名验证
export const VdUsername = {
  body: {
    name,
  },
};

// 邮箱验证，非body传入数据
export const VdEmailNoBody = {
  emailJoi,
};
