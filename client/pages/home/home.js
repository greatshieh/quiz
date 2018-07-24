//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

const app = getApp()

Page({
  data: {
    userInfo: null,
    logged: false,
    avatarUrl: ''
  },

  // 获取用户信息
  onLoad: function(options) {
    app.checkSession({
      success: ({
        userInfo
      }) => {
        console.log("session-key有效")
        this.setData({
          userInfo: userInfo,
          logged: true
        })
        // 保存用户信息到缓存
        wx.setStorage({
          key: 'userinfo',
          data: userInfo,
        })
      },
      error: () => {}
    })
  },

  onShow: function() {

  },


  onTapLogin: function(e) {
    // 保存到用户信息到缓存
    app.doQcloudLogin({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo,
          logged: true
        })
      }
    })
    wx.setStorage({
      key: 'userinfo',
      data: e.detail.userInfo,
    })
  },
})