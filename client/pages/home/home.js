//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({
    data: {
        userInfo: {},
        logged: false,
        avatarUrl: '',
        takeSession: false,
        requestResult: ''
    },

    // 获取用户信息
    onGotUserInfo: function (e) {
      
      var flag = e.detail.errMsg
      console.log(e.detail)
      if (flag === "getUserInfo:ok") {
        this.setData({
          logged: true,
          userInfo: e.detail.userInfo
      })}else{
        this.setData({
          logged:false
      })
      }

    }
})
