import * as echarts from "echarts";
import "../js/china";
import { getCitys } from "../../network/city";
import { debounce } from "../ts/debounce";
import { forDistricts, type City } from "../ts/forDistricts";
import { useCityArray } from "../../stores/item";
import { getMyIpCity } from "./toGetIp";
import { ref } from "vue";

export let myChart: echarts.ECharts;
export async function thisInitMap(
  doc: HTMLElement | null,
  clickCallback?: Function,
  startClickCallback?: Function
) {
  myChart = echarts.init(doc);

  // 检测useCityArray，若没有任何初始化值则将本地ip定位
  if (useCityArray().localCityArray.length === 0) {
    const cityIpObj = await getMyIpCity();
    // 定位后找数据，要进行异步等待
    await getCitys(cityIpObj?.adcode as string).then((res) => {
      useCityArray().addLocalCityArray(forDistricts(res.data.data?.districts));
    });
  }

  // data 展示地图对应方块 value对应坐标 x y
  let data = [
    {
      name: useCityArray().localCityArray[0].name,
      value: useCityArray().localCityArray[0].center.split(","),
    },
  ];

  myChart.setOption({
    geo: {
      map: "china",
      aspectScale: 0.8,
      layoutCenter: ["50%", "50%"],
      layoutSize: "120%",
      itemStyle: {
        areaColor: {
          type: "linear-gradient",
          x: 0,
          y: 1200,
          x2: 1000,
          y2: 0,
          colorStops: [
            {
              offset: 0,
              color: "#152E6E", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "#0673AD", // 50% 处的颜色
            },
          ],
          global: true, // 缺省为 false
        },
        shadowColor: "#0f5d9d",
        shadowOffsetX: 0,
        shadowOffsetY: 15,
        opacity: 0.5,
      },
      emphasis: {
        areaColor: "#0f5d9d",
      },
      regions: [
        {
          name: "南海诸岛",
          itemStyle: {
            areaColor: "rgba(0, 10, 52, 1)",
            borderColor: "rgba(0, 10, 52, 1)",
            opacity: 0,
            label: {
              show: false,
              color: "#009cc9",
            },
          },
          label: {
            show: false,
            color: "#FFFFFF",
            fontSize: 12,
          },
        },
      ],
    },
    series: [
      {
        type: "map",
        // selectedMode:"",
        map: "china",
        aspectScale: 0.8,
        layoutCenter: ["50%", "50%"], //地图位置
        layoutSize: "120%",
        zoom: 1, //当前视角的缩放比例
        // roam: true, //是否开启平游或缩放
        scaleLimit: {
          //滚轮缩放的极限控制
          min: 1,
          max: 2,
        },
        label: {
          show: true,
          color: "#FFFFFF",
          fontSize: 9,
        },
        itemStyle: {
          areaColor: "#0c3653",
          borderColor: "#1cccff",
          borderWidth: 1.8,
        },
        emphasis: {
          areaColor: "#56b1da",
          label: {
            show: true,
            color: "#fff",
          },
        },
        data: data,
      },
      {
        type: "scatter",
        coordinateSystem: "geo",
        symbol: "pin",
        symbolSize: [45, 45],
        // symbolOffset:[0, '-40%'] ,
        label: {
          show: true,
          // 标点展示的值
          color: "#000000",
          formatter(value: any) {
            return value.data.name;
          },
        },
        itemStyle: {
          color: "#D8BC37", //标志颜色
        },
        data: data,
      },
    ],
  });
  // 监听事件
  myChart.on("click", (e) => {
    // 开始时触发回调
    startClickCallback && startClickCallback();
    let inmyChart = myChart;
    // 请求数据
    const fn = debounce(() => {
      getCitys(e.name, 3)
        .then((res) => {
          // console.log(res);

          useCityArray().addLocalCityArray(
            forDistricts(res.data.data?.districts)
          );
          // console.log(useCityArray().localCityArray[0]?.center.split(","));

          // 同步小圆点,重新绘制标点
          redrawValue(inmyChart);
        })
        .finally(() => {
          // 执行回调
          clickCallback && clickCallback();
        });
    });
    fn();
  });
}
// 同步小圆点,重新绘制标点

export function redrawValue(myChart: echarts.ECharts) {
  myChart.setOption({
    series: [
      {
        data: [
          {
            name: useCityArray().localCityArray[0]?.name,
            value: useCityArray().localCityArray[0]?.center.split(","),
          },
        ],
      },
      {
        data: [
          {
            name: useCityArray().localCityArray[0]?.name,
            value: useCityArray().localCityArray[0]?.center.split(","),
          },
        ],
      },
    ],
  });
}
