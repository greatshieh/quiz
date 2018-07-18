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
      error: () => {
        console.log("session-key无效")
        wx.showModal({
          title: '没有登录',
          content: '',
        })
      }
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

  onTapLogin: function(e) {
    // this.setData({
    //   userInfo: e.detail.userInfo,
    //   logged: true
    // })

    // 保存到用户信息到缓存
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
    wx.setStorage({
      key: 'userinfo',
      data: e.detail.userInfo,
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
