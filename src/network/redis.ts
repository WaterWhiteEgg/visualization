import { postRequest } from "./index";

// 发送邮箱验证码
export const postToGetEmailCode = (email: string) => {
  return postRequest({
    url: "/email/emailCode",
    data: {
      email,
    },
  });
};
// 验证邮箱验证码
export const postToFindEmailCode = (email: string, emailCode: string) => {
  return postRequest({
    url: "/email/emailCodeRes",
    data: {
      email,
      emailCode,
    },
  });
};
