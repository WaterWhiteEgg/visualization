import axios from "axios";

type Option = {
  url: string;
  params?: object;
  headers?: {
    Authorization?: string;
  };
  data?: object | string;
};
// 默认的请求地址
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:2000' : 'http://8.134.196.45:2000';
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
