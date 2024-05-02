// 获取IP地所在的数据
import type { AxiosResponse } from "axios";
import { getMyIp, getIpCity, get_ip_city_lbs_amap } from "../../network/city";

type OtherCityResponse = AxiosResponse<{
  data: {
    error_code: number;
    reason: string;
    result: {
      Country: string;
      Province: string;
      City: string;
      District: string;
      Isp: string;
    };
    resultcode: string;
  };
  message: string;
  status: number;
}>;
type CityResponse = AxiosResponse<{
  status: string;
  info: string;
  infocode: string;
  province: unknown[];
  adcode: string | unknown[];
  city: unknown[];
  rectangle: unknown[];
  statusText: string;
}>;

type IpResponse = AxiosResponse<
  {
    data: string;
    message: string;
    status: number;
  },
  {
    message: string;
    status: number;
  }
>;
export async function getMyIpCity() {
  try {
    // 会返回用户的ipv4地址
    const ipResponse: IpResponse = await getMyIp();
    console.log("你的ip是" + ipResponse.data.data);
    // get_ip_city_lbs_amap来自高德的接口，不用处理跨域，同时ip地址搜索不知道为什么找不到
    let cityResponse: CityResponse = await get_ip_city_lbs_amap(
      ipResponse.data.data
    );
    console.log(cityResponse);
    // 由于高德ip接口不知如何都出不来结果，所以添加了一个额外的接口，数据结构是不一样的
    // 当高德无法送ipv4搜索出ip地时会使用它，如果还是搜不出这就是ip地址的问题或者次数没了之类的了

    // 判断get_ip_city_lbs_amap是否获取的是空的
    if (cityResponse.data.infocode === "10000") {
      // 这是另一个需要处理跨域的接口，50/天,太少了，所以考虑哪怕高德接口搜不出来也算了
      let otherCityResponse: OtherCityResponse = await getIpCity(
        ipResponse.data.data
      );
      // console.log(otherCityResponse);
      // 查询另一个接口的内容
      if (otherCityResponse?.data?.data.result.City === "") {
        console.log("无法解析" + ipResponse.data.data + " ？ip地址");
        // 查询不到的话就直接不提供ip
        cityResponse = await get_ip_city_lbs_amap();
        return cityResponse.data.adcode;
        // return otherCityResponse.data.data;
      } else {
        return otherCityResponse.data.data.result.City;
      }
    }
    // 查询成功直接返回
    else {
      return cityResponse.data.adcode;
    }
  } catch (error) {
    console.error(error);
  }
}
