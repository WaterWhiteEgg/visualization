import * as echarts from "echarts";
import { useCityArray } from "../../stores/item";
export let myPicChart: echarts.ECharts;
// 饼图绘制
export function initPie(doc: HTMLElement | null) {
  myPicChart = echarts.init(doc);

  // 数据
  const data = [
    {
      value: useCityArray().localWeather[0]?.humidity_float || 0,
      name: "湿度",
    },
    {
      value: useCityArray().localWeather[0]?.temperature_float || 0,
      name: "温度",
    },
  ];

  myPicChart.setOption({
    animation: false,
    tooltip: {
      trigger: "item",
    },

    legend: {
      top: "5%",
      left: "center",
      textStyle: {
        color: "#e0e5ff",
      },
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],

        itemStyle: {
          borderRadius: 0,
          borderColor: "#f0f8ff",

          borderWidth: 1,
        },
        label: {
          color: "#ffffff",

          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 15,
          },
        },
        labelLine: {
          show: false,
          color: "#ffffff",
        },
        data,
      },
    ],
  });
}

// 重新加载数据
export function redrawPieValue(myPicChart: echarts.ECharts) {
  myPicChart.setOption({
    series: [
      {
        data: [
          {
            value:
              useCityArray()?.localWeather &&
              useCityArray()?.localWeather[0].humidity_float,
            name: "湿度",
          },
          {
            value:
              useCityArray()?.localWeather &&
              useCityArray()?.localWeather[0]?.temperature_float,
            name: "温度",
          },
        ],
      },
    ],
  });
}
