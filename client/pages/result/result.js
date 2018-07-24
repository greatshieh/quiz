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

    var scoreList = new Array()

    //从数据库查询结果中解析所有的成绩
    result.forEach(element => {
      scoreList.push(element.total_score)
    })

    scoreList = scoreList.sort(function(a, b) {
      return b - a
    })

    //测试的次数
    var length = scoreList.length

    this.setData({
      cnt: length, //测试次数
      maximum: scoreList.shift(), //最高分
      minimum: scoreList.pop() //最低分
    })

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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})