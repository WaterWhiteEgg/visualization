import { request } from "./index";

export const getWeather = (city: string) => {
  return request({
    url: "/weather",
    params: {
      city,
    },
  });
};
