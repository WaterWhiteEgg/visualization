import axios from "axios";
import { useToken } from "../stores/token";

// 高德，聚何ip，api,仅在生产模式编译
import { key } from "./realdata/key";
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
const baseURL = useToken().isDevelopmentMode
  ? "http://localhost:2000"
  : "http://8.134.196.45:2000";

export const request = (option: Option) => {
  const net1 = axios.create({
    method: "get",
    baseURL,
    timeout: 10000,
  });
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
