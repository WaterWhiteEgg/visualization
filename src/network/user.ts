import { request } from "./index";

export const getUserData = () => {
  return request({
    url: "/user",
  });
};
