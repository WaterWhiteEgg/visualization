import { request } from "./index";

export const getCitys = (keywords: string) => {
  return request({
    url: "/city",
    params: {
        keywords,
    },
  });
};
