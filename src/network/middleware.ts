import { type InternalAxiosRequestConfig } from "axios";

// token 放入请求头
export const TokenVerification = function (config: InternalAxiosRequestConfig) {
  // 发送请求的相关逻辑
  // config:对象  与 axios.defaults 相当
  // 获取token

  let userinfo = window.localStorage.getItem("token");
  // console.log(userinfo);

  // 判断token存在再做配置
  if (userinfo) {
    let token = JSON.parse(userinfo).token;
    
    // 注意：token前边有 'Bearer ' 的信息前缀,API接口需求，Bearer后边有空格
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
};

// 错误函数
export const TokenVerificationError = function (error: unknown) {
  return Promise.reject(error);
};
