//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
  data: {
    total_score: 0
  },
  onLaunch: function() {
    qcloud.setLoginUrl(config.service.loginUrl)
  }
})