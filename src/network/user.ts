import { request } from "./index";


export const userVerifyToken = () => {
  return request({
    url: "/verifyToken",
  });
};
export const getEasyUserData = () => {
  return request({
    url: "/easyuser",
  });
};

export const getUserData = () => {
  return request({
    url: "/user",
  });
};
