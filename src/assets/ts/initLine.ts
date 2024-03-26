import * as echarts from "echarts";
import { useCityArray } from "../../stores/item";
export let myLineChart: echarts.ECharts;
// 饼图绘制
export function initLine(doc: HTMLElement | null) {
    myLineChart = echarts.init(doc)

    // 数据
    let data = [
        { value: useCityArray().localWeather[0].humidity_float, name: '湿度' },
        { value: useCityArray().localWeather[0].temperature_float, name: '温度' },
    ]


    myLineChart.setOption({
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                areaStyle: {}
            }
        ]
    });

}


// 重新加载数据
export function redrawLineValue(myLineChart: echarts.ECharts) {
    myLineChart.setOption({
        series: [
            {
                data: [

                ]
            }
        ],
    });
}