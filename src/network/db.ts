import { postRequest } from "./index";

export const commitUser = (data: object) => {
  return postRequest({
    url: "/db/register",
    data: data,
  });
};
export const loginUser = (data: object) => {
  return postRequest({
    url: "/db/login",
    data: data,
  });
};
export const guestLoginUser = (data: object) => {
  return postRequest({
    url: "/db/guest/login",
    data: data,
  });
};
export const findUsername = (data: {name:string}) => {
  return postRequest({
    url: "/db/username",
    data: data,
  });
};
