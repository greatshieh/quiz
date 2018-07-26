const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    cnt: 0,
    maximum: 0,
    minimum: 0,
    ismax: false
  },

  backtoindex() {
    wx.redirectTo({
      url: '../home/home'
    })
  },

  backtochallenge() {
    wx.redirectTo({
      url: '../person/person',
    })
  },

  parseResult(result) {
    this.setData({
      cnt: result[0], //测试次数
      maximum: result[1], //最高分
      minimum: result[2] //最低分
    })

    if(this.data.score >= this.data.maximum){
      this.setData({
        ismax: true
      })
    }

  },

  onShareAppMessage: function(res) {
    return {
      title: '知识挑战，快来参加把！',
      path: '../home/home',
      success: function() {},
      fail: function() {}
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var app = getApp()
    this.setData({
      score: app.data.total_score
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    app.getResult({
      success: ({
        data
      }) => {
        this.parseResult(data)
      }
    })
  },
})