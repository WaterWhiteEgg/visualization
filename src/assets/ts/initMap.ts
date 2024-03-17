import * as echarts from "echarts";
import "../js/china";
import { geoCoordMap } from "../ts/geomap";

import { getCitys } from "../../network/city";
import { debounce } from "../ts/debounce";
import { forDistricts } from "../ts/forDistricts";

export default function (doc: HTMLElement | null) {
  let myChart = echarts.init(doc);
  // data 展示地图对应方块 value对应坐标 x y
  let data = [
    {
      name: "光照镇",
      value: ["105.299982", "25.8453"],
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
    // 请求数据
    const fn = debounce(() => {
      getCitys(e.name).then((res) => {
        // console.log(res);
        console.log(forDistricts(res.data.data?.districts));
      });
    });
    fn();
  });
}
