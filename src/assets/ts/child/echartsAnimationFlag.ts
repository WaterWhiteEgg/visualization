// 判断echarts的动画展示
export function changeAnimation(
  myLineChart: echarts.ECharts,
  flag: boolean = false
) {
  myLineChart.setOption({
    animation: flag,
  });
}
