import { request } from "./index";

export const userVerifyToken = () => {
  return request({
    url: "/verifyToken",
  });
};
export const getEasyUserData = (user_id: string) => {
  return request({
    url: "/easyuser?user_id=" + user_id,
  });
};

export const getUserData = () => {
  return request({
    url: "/user",
  });
};
