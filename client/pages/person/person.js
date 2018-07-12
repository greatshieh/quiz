const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    option: [],
    title_cnt: 0, //题目计数
    lFlag: false
  },
  
  getQuiz() {
    wx.showLoading({
      title: '加载题目',
    })

    qcloud.request({
      url: config.service.getQuiz,
      success: result => {
        wx.hideLoading()
        let data = result.data.data

        var temp = data.options.replace("[", "")

        temp = temp.replace("]", "")

        var options = temp.split(",")

        var cnt = this.data.title_cnt
        cnt += 1
        this.setData({
          title: data.title,
          option: options,
          title_cnt: cnt,
          lFlag: true
        })
      },

      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '题目列表加载错误',
        })
        this.setDataP({
          lFlag: true,
        })
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getQuiz()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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