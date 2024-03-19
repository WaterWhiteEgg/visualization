// 获取IP所在的数据

import type { AxiosResponse } from "axios";
import { getMyIp, getIpCity } from "../../network/city";

export async function getMyIpCity() {
    try {
        let ipResponse: AxiosResponse<{
            data: string,
            message: string
            status: number
        }, any> = await getMyIp();
        //   console.log(ipResponse.data.data);
        let cityResponse: AxiosResponse<{
            data: {
                rectangle: string,
                city: string,
                adcode: string,
                infocode: string,
                province: string
            },
            message: string
            status: number
        }, any> = await getIpCity(ipResponse.data.data);
        // console.log(cityResponse);
        // 有可能存在局域网/外网/没有等情况，所以本地ip找不到时找别人ip定位，还是找不到也没办法
        if (cityResponse.data.data.infocode === "10000") {
            cityResponse = await getIpCity();
            return cityResponse.data.data

        } else {
            return cityResponse.data.data;

        }

    } catch (error) {
        console.error(error);
    }
}

