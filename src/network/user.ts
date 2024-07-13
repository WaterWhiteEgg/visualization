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

export interface Tokendata {
  data: {
    exp: number;
    iat: number;
    status: { resource: string };
    user: { username: string; user_id: string };
  };
  message: string;
  status: 1 | 0;
}

export interface Userdata {
  exp: number;
  iat: number;
  status: { resource: string };
  user: { username: string; user_id: string };
}
