//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')

Page({
  data: {
    userInfo: null,
    logged: false,
    avatarUrl: ''
  },

  // 获取用户信息
  onLoad: function(options) {
    this.checkSession({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo: userInfo,
          logged: true
        })
      },
      error: () => {}
    })
  },

  checkSession({
    success,
    error
  }) {
    wx.checkSession({
      success: () => {
        this.getUserInfo({
          success,
          error
        })
      },
      fail: () => {
        error && error()
      }
    })
  },

  onTapLogin: function() {
    this.doQcloudLogin({
      success: ({
        userInfo
      }) => {
        this.setData({
          userInfo,
          logged: true
        })
      }
    })
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

  doQcloudLogin({
    success,
    error
  }) {
    // 调用 qcloud 登陆接口
    qcloud.login({
      success: result => {
        if (result) {
          let userInfo = result
          console.log(userInfo)
          success && success({
            userInfo
          })
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          this.getUserInfo({
            success,
            error
          })
        }
      },
      fail: () => {
        error && error()
      }
    })
  },
})
