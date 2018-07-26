import * as echarts from '../ec-canvas/echarts.js';

function init_chart(ecComponent, option, args) {
    ecComponent.init((canvas, width, height) => {
        // 获取组件的 canvas、width、height 后的回调函数
        // 在这里初始化图表
        const chart = echarts.init(canvas, null, {
            width: width,
            height: height
        });
        canvas.setChart(chart);
        chart.setOption(option(args));

        // 注意这里一定要返回 chart 实例，否则会影响事件处理等
        return chart;
    });
};

// 柱状图
function graphBar(args) {
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: args[0],
            boundaryGap: false,
            axisLine: {
                lineStyle: {
                    color: '#999'
                }
            },
            axisLabel: {
                color: '#666'
            }
        },
        yAxis: {
            type: 'value',
            show: false,
        },
        series: [{
            data: args[1],
            type: 'bar',
            markPoint: {
                data: [{
                        type: 'max',
                        name: '最高值'
                    },
                    {
                        type: 'min',
                        name: '最低值'
                    }
                ]
            },
            markLine: {
                data: [{
                    type: 'average',
                    name: '平均分'
                }]
            },
        }]
    }
    return option;

};

// 折线图
function graphLine(args) {
    var option = {
        title: {
            text: args[0]
        },
        xAxis: {
            type: 'category',
            data: args[1]
        },
        yAxis: {
            type: 'value',
            show: false,
        },
        series: [{
            data: args[2],
            type: 'line',
            showAllSymbol: true,
            symbolSize: function(value) {
                return Math.round(value / 5) + 2;
            },
            markPoint: {
                data: [{
                        type: 'max',
                        name: '最高值'
                    },
                    {
                        type: 'min',
                        name: '最低值'
                    }
                ]
            },
            markLine: {
                data: [{
                    type: 'average',
                    name: '平均分'
                }]
            },
        }]
    }
    return option;

};

// 饼图/环形图
function graphCycle(args) {
    var option = {
        title: {
            text: '考察内容分布'
        },
        series: [{
            label: {
                normal: {
                    fontSize: 12
                }
            },
            type: 'pie',
            center: ['50%', '50%'],
            radius: ['50%', '70%'],
            data: args[0],
            itemStyle: {
                normal: {
                    labelLine: {
                        show: true,
                        length: 2,
                    },
                },
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 2, 2, 0.3)'
                }
            }
        }]
    }
    return option;
};

// 雷达图
function graphRadar(args) {
    var option = {
        title: { text: '知识能力图谱' },
        // backgroundColor: "#ffffff",
        // color: ["#37A2DA", "#FF9F7F"],
        tooltip: {},
        xAxis: {
            show: false
        },
        yAxis: {
            show: false
        },
        radar: {
            // shape: 'circle',
            indicator: args[0]
        },
        series: [{
            // name: '预算 vs 开销',
            type: 'radar',
            data: args[1]
        }]
    };
    return option;
};

function graphStack(args) {
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: args[0]
        },
        calculable: true,
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: args[1]
        }],
        yAxis: [{
            type: 'value'
        }],
        series: args[2]
    };
    return option
};

// 暴露接口
module.exports = {
    init_chart: init_chart,
    graphBar: graphBar,
    graphLine: graphLine,
    graphCycle: graphCycle,
    graphRadar: graphRadar,
    graphStack: graphStack,
};