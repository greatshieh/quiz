const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

var app = getApp()
var result = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F"
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    option: [],
    lFlag: false,
    style: '单选题',
    answer: '', //选择的答案
    id: "",
    cnt: 0,
    max_cnt: 10,
    score: 0, //题目的分数
    std_answer: ''
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

  // 计算总分
  calcScore(){
    var data = this.data
    // 记录分数
    if (data.cnt > 0) {
      //有题目出现时
      if (result[data.id] === data.std_answer) {
        //结果正确
        app.data.total_score += data.score
      }
    }
  },

  getQuiz() {
    // 加载题目
    wx.showLoading({
      title: '加载题目',
    })

    if (this.data.cnt === this.data.max_cnt) {
      // 达到最大题目数量，提交结果
      this.calcScore()
      console.log(app.data.total_score)
      wx.showLoading({
        title: '正在提交结果...',
      })

      wx.redirectTo({
        url: '../result/result',
      })
      wx.hideLoading()
    } else {
      this.calcScore()
      // 更新题目
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
            lFlag: true,
            std_answer: data.answer,
            score: data.scort
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