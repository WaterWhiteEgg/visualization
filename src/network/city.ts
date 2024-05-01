import { request ,lbs_amap_request} from "./index";

export const getCitys = (keywords: string, subdistrict?: 0 | 1 | 2 | 3) => {
  return request({
    url: "/city",
    params: {
      keywords,
      subdistrict,
    },
  });
};
export const getMyIp = () => {
  return request({
    url: "/myip",
  });
};

export const getIpCity = (ip?: string) => {
  return lbs_amap_request({
    url: "/ip",
    params: {
      ip,
    }
  });
};
