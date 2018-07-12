const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    option: [],
    lFlag: false,
    style: '单选题',
    answer: '',
    id: '',
    cnt: 0,
    max_cnt: 10,
  },

  // 答案选择,获取用户选择的单选框的值
  radioChange: function(e) {

    var arr = this.data.option
    var item = e.detail.value

    this.setData({
      answer: e.detail.value,
      id: arr.indexOf(item)
    })
  },

  getQuiz() {
    wx.showLoading({
      title: '加载题目',
    })
    if (this.data.cnt === this.data.max_cnt) {
      wx.showLoading({
        title: '正在提交结果...',
      })

      wx.navigateTo({
        url: '../result/result',
      })
      wx.hideLoading()
    } else {
      qcloud.request({
        url: config.service.getQuiz,
        success: result => {
          wx.hideLoading()
          let data = result.data.data

          var temp = data.options.replace("[", "")

          temp = temp.replace("]", "")

          var options = temp.split(",")
          var cnt = this.data.cnt
          cnt += 1
          this.setData({
            title: data.title,
            option: options,
            cnt: cnt,
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
    }
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