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
// userdata数据类型
export interface UserData {
  username: string;
  status?: number;
  descs: string;
  gender: number;
  user_id: string;
  is_guest?: number;
  email?: string;
  phone_number?: string;
  registration_time: string;
  last_time: string;
  login_count?: number;
  is_active: number;
  is_admin?: number;
}

// user的请求结构
export interface UserAxiosData {
  data: string;
  message: string;
  status: 0 | 1;
}
