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
