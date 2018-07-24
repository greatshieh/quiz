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

    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    // this.chart = chart;

    // this.setData({
    //   isLoaded: true,
    //   isDisposed: false
    // });

    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return chart;
  });
};

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

function graphCycle(args) {
  var option = {
    title: {
      text: '考察内容分布'
    },
    series: [{
      label: {
        normal: {
          fontSize: 14
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      // radius: [0, '60%'],
      radius: ['50%', '70%'],
      data: [{
          value: 25,
          name: '国家认同'
        },
        {
          value: 17.5,
          name: '科学技术'
        },
        {
          value: 12.5,
          name: '生活常识'
        },
        {
          value: 10,
          name: '体音舞美'
        },
        {
          value: 10,
          name: '社会常识'
        },
        {
          value: 10,
          name: '世界认识'
        },
        {
          value: 7.5,
          name: '自然地理'
        },
        {
          value: 7.5,
          name: '区域认同'
        }
      ],
      itemStyle: {
        normal: {
          labelLine: {
            show: false,
            length:0,
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


function graphRadar(){
  var option = {
    // backgroundColor: "#ffffff",
    color: ["#37A2DA", "#FF9F7F"],
    tooltip: {},
    xAxis: {
      show: false
    },
    yAxis: {
      show: false
    },
    radar: {
      // shape: 'circle',
      indicator: [{
        max: 10,
        name: '国家认同'
      },
        {
          max: 10,
          name: '科学技术'
        },
        {
          max: 10,
          name: '生活常识'
        },
        {
          max: 10,
          name: '体音舞美'
        },
        {
          max: 10,
          name: '社会常识'
        },
        {
          max: 10,
          name: '世界认识'
        },
        {
          max: 10,
          name: '自然地理'
        },
        {
          max: 10,
          name: '区域认同'
        }
      ]
    },
    series: [{
      // name: '预算 vs 开销',
      type: 'radar',
      data: [{
        value: [8, 2, 10, 10, 8, 5, 7, 7],
        // name: '预算'
      },
      // {
      //   value: [300, 430, 150, 300, 420, 250],
      //   name: '开销'
      // }
      ]
    }]
  };
  return option;
};


module.exports = {
  init_chart: init_chart,
  graphBar: graphBar,
  graphLine: graphLine,
  graphCycle: graphCycle,
  graphRadar: graphRadar
};