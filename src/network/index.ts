import axios from "axios";
type Option = {
  url: string;
  params?:object;
  headers?: {
    Authorization?: string;
  };
  data?: object;
};

export const request = (option: Option) => {
  const net1 = axios.create({
    method: "get",
    baseURL: "http://localhost:2000",
    timeout: 10000,
  });
  return net1(option);
};
