import { postRequest } from "./index";

export const commitUser = (json: object) => {
  return postRequest({
    url: "/db/register",
    data: json,
  });
};
export const loginUser = (json: object) => {
  return postRequest({
    url: "/db/login",
    data: json,
  });
};
export const findUsername = (json: object) => {
  return postRequest({
    url: "/db/username",
    data: json,
  });
};
