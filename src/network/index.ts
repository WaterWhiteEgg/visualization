import axios from "axios";
type Option = {
  url: string;
  params?: object;
  headers?: {
    Authorization?: string;
  };
  data?: object | string;
};

export const request = (option: Option) => {
  const net1 = axios.create({
    method: "get",
    baseURL: "http://localhost:2000",
    timeout: 10000,
  });
  return net1(option);
};
export const postRequest = (option: Option) => {
  const net2 = axios.create({
    method: "post",
    baseURL: "http://localhost:2000",
    timeout: 10000,
  });
  return net2(option);
};
