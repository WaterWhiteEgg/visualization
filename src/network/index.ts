import axios from "axios";


// import "./middleware"; //导入网络拦截守卫




// 高德，聚何ip，api,仅在生产模式编译
import { key } from "./realdata/key";

const TokenVerification = function (config) {
  // 发送请求的相关逻辑
  // config:对象  与 axios.defaults 相当
  // 获取token

  let userinfo = window.sessionStorage.getItem("token");
  console.log(userinfo);

  // 判断token存在再做配置
  if (userinfo) {
    let token = JSON.parse(userinfo).token;
    // 注意：token前边有 'Bearer ' 的信息前缀,API接口需求，Bearer后边有空格
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
};
const TokenVerificationError = function (error) {
  // Do something with request error
  return Promise.reject(error);
};

// import { inkey } from "./key";
type Option = {
  url: string;
  params?: object;
  headers?: {
    Authorization?: string;
  };
  data?: object | string;
};
// 默认的请求地址

const baseURL = import.meta.env.MODE === "development"
  ? "http://localhost:2000"
  : "http://8.134.196.45:2000";
// const baseURL = "http://localhost:2000";
export const request = (option: Option) => {
  const net1 = axios.create({
    method: "get",
    baseURL,
    timeout: 10000,
  });
  // net1.interceptors.request.use(TokenVerification, TokenVerificationError);
  return net1(option);
};

export const postRequest = (option: Option) => {
  const net2 = axios.create({
    method: "post",
    baseURL,
    timeout: 10000,
  });
  return net2(option);
};

// 来自高德的api接口
export const lbs_amap_request = (option: Option) => {
  const net3 = axios.create({
    baseURL: "https://restapi.amap.com/v3",
    params: {
      // 在生产测试中直接用realkey
      key,
      // 若是在dev中使用
      // key: useRegister().isDevelopmentMode ? inkey : key,
    },
    timeout: 10000,
  });
  return net3(option);
};
