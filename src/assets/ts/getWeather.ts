import { myPicChart, redrawPieValue } from "./initPie";
import { getWeather } from "../../network/weather";
import { type DataWeather } from "../ts/forDistricts";
import { useCityArray } from "../../stores/item";

// 城市天气请求，一定要城市编码
export const inGetWeather = (code: string) => {
  getWeather(code).then((res) => {
    const weatherData = res.data.data as DataWeather;
    const weatherLive = weatherData.lives;
    useCityArray().addLocalWeather(weatherLive);
    // console.log(weatherLive);
    // 刷新饼图的数据
    redrawPieValue(myPicChart);
  });
};
