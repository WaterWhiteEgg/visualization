import * as echarts from "echarts";
import { useCityArray } from "../../stores/item";
export let myLineChart: echarts.ECharts;
// 饼图绘制
export function initLine(doc: HTMLElement | null) {
  myLineChart = echarts.init(doc);

  // 底部数据
  const Xdata = useCityArray().localCityArray.map((item) => item.name);
  // 顶部数据
  const Ydata = useCityArray().localCityArray.map((item) => item.adcode);

  myLineChart.setOption({
    xAxis: {
      type: "category",
      data: Xdata,
      axisLabel: {
        color: "#fff",
        interval: 0,
        rotate: "90",
      },
      // formatter:function(param){

      // }
    },
    yAxis: {
      type: "value",
      min: "dataMin",
      max: "dataMax",
      scale: true,
    },
    label: {
      show: true,
      color: "#c7c7c7",
      rotate: "90",
      padding: [0, -40, -5, 0],
    },

    series: [
      {
        data: Ydata,
        type: "line",
        areaStyle: {
          color: "#72bbff",
        },
      },
    ],
  });
}

// 重新加载数据
export function redrawLineValue(myLineChart: echarts.ECharts) {
  myLineChart.setOption({
    xAxis: {
      data: useCityArray().localCityArray.map((item) => item.name),
    },
    series: [
      {
        data: useCityArray().localCityArray.map((item) => item.adcode),
      },
    ],
  });
}
