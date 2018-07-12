const qcloud = require('../../vendor/wafer2-client-sdk/index')

const config = require('../../config.js')


var touchDot = 0; //触摸时的原点
var time = 0; //  时间记录，用于滑动时且时间小于1s则执行左右滑动
var interval = ""; // 记录/清理 时间记录
var nth = 0; // 设置活动菜单的index
var nthMax = 20; //活动菜单的最大个数
var tmpFlag = true; // 判断左右华东超出菜单最大值时不再执行滑动事件

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    option: []
  },
  // 触摸开始事件
  touchStart: function(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点
    // 使用js计时器记录时间    
    interval = setInterval(function() {
      time++;
    }, 100);
  },
  // 触摸移动事件
  touchMove: function(e) {
    var touchMove = e.touches[0].pageX;
    
    // 向左滑动   
    if (touchMove - touchDot <= -40 && time < 10) {
      console.log("左滑")
      if (tmpFlag && nth < nthMax) { //每次移动中且滑动时不超过最大值 只执行一次
        this.getQuiz(); // 更新题目,
        nth += 1
      }
    }
  },
  // 触摸结束事件
  touchEnd: function(e) {
    clearInterval(interval); // 清除setInterval
    time = 0;
    tmpFlag = true; // 回复滑动事件
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

        console.log(temp)
        this.setData({
          title: data.title,
          option: options
        })
      },

      fail: () => {
        wx.hideLoading()

        wx.showToast({
          title: '题目列表加载错误',
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