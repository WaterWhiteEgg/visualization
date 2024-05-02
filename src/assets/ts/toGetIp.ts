// 获取IP所在的数据

import type { AxiosResponse } from "axios";
import { getMyIp, getIpCity, get_ip_city_lbs_amap } from "../../network/city";

export async function getMyIpCity() {
  try {
    const ipResponse: AxiosResponse<
      {
        data: string;
        message: string;
        status: number;
      },
      {
        message: string;
        status: number;
      }
    > = await getMyIp();

    let cityResponse: AxiosResponse<{
      status: string;
      info: string;
      infocode: string;
      province: unknown[];
      adcode: string | unknown[];
      city: unknown[];
      rectangle: unknown[];
      statusText: string;
    }> = await get_ip_city_lbs_amap(ipResponse.data.data);
    // console.log(cityResponse);
    // 有可能存在局域网/外网/没有等情况，所以本地ip找不到时找别人ip定位，还是找不到也没办法
    console.log(cityResponse);

    // 没啥办法。目前先用别的接口暂时解决
    if (cityResponse.data.infocode === "10000") {
      console.log(ipResponse.data.data);
      let otherCityResponse = await getIpCity(ipResponse.data.data);
      console.log(otherCityResponse);
      // 查询另一个接口的内容
      if (otherCityResponse?.data?.data.result.City === "") {
        console.log("未查询到你的ip地址方位");
        // 查询不到的话就直接不提供ip，查询用户地址的我也不知道怎么提供了反而查不到
        cityResponse = await get_ip_city_lbs_amap();
        return cityResponse.data;
        // return otherCityResponse.data.data;
      } else {
        return otherCityResponse.data.data;
      }
    }
    // 查询成功直接返回
    else {
      return cityResponse.data;
    }
  } catch (error) {
    console.error(error);
  }
}
