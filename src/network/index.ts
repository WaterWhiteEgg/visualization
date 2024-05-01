import axios from "axios";
<<<<<<< HEAD
import { key ,IPkey} from "./realData/key";
=======
import { key } from "./realData/key";
>>>>>>> 5c096eb58e3b7e43a3cc109d6e2e0226dddf650f
type Option = {
  url: string;
  params?: object;
  headers?: {
    Authorization?: string;
  };
  data?: object | string;
};
// 默认的请求地址
console.log(import.meta.env.MODE);

const baseURL =
  import.meta.env.MODE === "development"
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
      key,
    },
    timeout: 10000,
  });
  return net3(option);
};
<<<<<<< HEAD

export const juhe_request = (option: Option) => {
  const net4 = axios.create({
    baseURL: "http://apis.juhe.cn/ip/ipNewV3",
    params: {
      key:IPkey,
    },
    timeout: 10000,
  });
  return net4(option);
};
=======
>>>>>>> 5c096eb58e3b7e43a3cc109d6e2e0226dddf650f
