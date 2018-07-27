//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
let userInfo

App({
    data: {
        total_score: 0,
        category_score: new Array()
    },

    onLaunch: function() {
        qcloud.setLoginUrl(config.service.loginUrl)
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
                console.log("session-key无效")
                wx.showModal({
                    title: '提示',
                    content: '请授权我们获取您的用户信息，以便提供详细的成绩分析报告',
                    success: (res) => {
                        if (res.confirm) {
                            console.log("授权登录")
                            this.doQcloudLogin({
                                success,
                                error
                            })
                        } else {
                            console.log("没有授权")
                        }
                    }
                })
                error && error()
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

    getResult({
        success,
        error
    }) {
        //发送请求，获得所有题目
        qcloud.request({
            url: config.service.downloadResult,
            success: result => {
                let data = result.data.data
                success && success({
                    data
                })
            },
            fail: () => {
                wx.showToast({
                    title: '获取数据失败...',
                })
            }
        })
    },
})