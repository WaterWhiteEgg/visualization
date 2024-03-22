// 将里面的districts全部遍历出来
export type City = {
  citycode: string | null[];
  adcode: string;
  name: string;
  level: string;
  center: string;
  districts: City[];
};
export type Weather = {
  adcode: string;
  city: string;
  humidity: string;
  humidity_float: string;
  province: string;
  reporttime: string;
  temperature: string;
  temperature_float: string;
  weather: string;
  winddirection: string;
  windpower: string;
};

export type DataWeather = {
  count: string;
  info: string;
  infocode: string;
  lives: Weather[];
  status: string;
};

export function forDistricts(city: City[]) {
  let allArray = city;
  // 将所有的districts获取
  const forDistricts = (inAllArray: City[]) => {
    // console.log(inAllArray);
    inAllArray.forEach((item) => {
      // console.log(item);
      // 判断是否再次遍历
      let isAgain = false;
      //  递归

      if (item.districts.length !== 0) {
        isAgain = true;
        allArray = allArray.concat(item.districts);
      }
      if (isAgain) {
        forDistricts(item.districts);
      }
    });
  };
  forDistricts(allArray);
  return allArray;
}
