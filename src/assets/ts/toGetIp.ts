// 获取IP所在的数据

import type { AxiosResponse } from "axios";
import { getMyIp, getIpCity } from "../../network/city";

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
      city: unknown[];
      rectangle: unknown[];
      statusText: string;
    }> = await getIpCity(ipResponse.data.data);
    // console.log(cityResponse);
    // 有可能存在局域网/外网/没有等情况，所以本地ip找不到时找别人ip定位，还是找不到也没办法
    console.log(cityResponse);

    if (cityResponse.data.infocode === "10000") {
      console.log("未查询到你的ip地址方位");
      // 查询不到的话就直接不提供ip，查询用户地址的我也不知道怎么提供了反而查不到
      cityResponse = await getIpCity();
    console.log(cityResponse);

      return cityResponse.data;
    }
    // 查询成功直接返回
    else {
      return cityResponse.data;
    }
  } catch (error) {
    console.error(error);
  }
}
