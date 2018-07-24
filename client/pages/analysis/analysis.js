var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var echart = require('../../utils/echarts.js')

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    quizSequence: [],
    scoreList: [],
    cnt: [],
    total: 0,
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    }
  },

  readStorage: function() {
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        this.setData({
          userInfo: res.data
        })
      },
      fail: () => {
        wx.showModal({
          title: '无法获取成绩报告',
          content: '你还没有登录，将无法生成成绩报告，请返回登录',
          success: () => {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取组件
    this.graphLine = this.selectComponent('#mychart-dom-line');
    this.graphCycle = this.selectComponent('#mychart-dom-pie');
    this.graphRadar = this.selectComponent('#mychart-dom-radar');
    // 读取用户信息
    this.readStorage()

    // 获取成绩信息
    app.getResult({
      success: ({
        data
      }) => {
        this.parseResult(data)
        var dataList = this.data.scoreList
        var xlabel = this.data.cnt
        // 初始化图表
        echart.init_chart(this.graphLine, echart.graphLine, ['成绩趋势图', xlabel, dataList]);
        echart.init_chart(this.graphCycle, echart.graphCycle, []);
        echart.init_chart(this.graphRadar, echart.graphRadar, []);
      }
    })
  },

  parseResult: function(res) {
    // 测试顺序排名
    var quizSequence = new Array()

    // 所有测试分数集合
    var scoreList = new Array()

    // 测试次数计数
    var cnt = new Array()
    var i = 1
    res.forEach(function(element) {
      cnt.push('第' + i + '次')
      quizSequence.push(element.id)
      scoreList.push(element.total_score)
      i++
    })

    this.setData({
      quizSequence: quizSequence,
      scoreList: scoreList,
      cnt: cnt,
      total: cnt.length
    })
  },

});