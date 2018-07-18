var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 读取用户信息
    wx.getStorage({
      key: 'userinfo',
      success: (res) => {
        console.log(res.data)
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

  },

  getUserInfo({
    success,
    error
  }) {
    qcloud.request({
      url: config.service.requestUrl,
      login: true,
      success: result => {
        let data = result.data

        if (!data.code) {
          let userInfo = data.data

          success && success({
            userInfo
          })
        } else {
          error && error()
        }
      },
      fail: () => {
        error && error()
      }
    })
  },
})