var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var echart = require('../../utils/echarts.js')

const app = getApp()

var scoreList = new Array()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null,
        total: 0,
        cnt: new Array(),
        category_max: new Array(),
        category_score: new Array(),
        category: new Array(),
        ec: {
            // 将 lazyLoad 设为 true 后，需要手动初始化图表
            lazyLoad: true
        }
    },

    readStorage: function() {
        wx.getStorage({
            key: 'userinfo',
            success: (res) => {
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
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取组件
        this.graphLine = this.selectComponent('#mychart-dom-line');
        this.graphCycle = this.selectComponent('#mychart-dom-pie');
        this.graphRadar = this.selectComponent('#mychart-dom-radar');
        this.graphStack = this.selectComponent('#mychart-dom-stack');
        // 读取用户信息
        this.readStorage()

        // 获取成绩信息
        app.getResult({
            success: ({
                data
            }) => {
                this.setData({
                    total: data[0]
                })
                this.parseResult(data)

                // 初始化图表
                echart.init_chart(this.graphLine, echart.graphLine, ['成绩趋势图', this.data.cnt, data[3]]);
                echart.init_chart(this.graphCycle, echart.graphCycle, [data[4]]);
                echart.init_chart(this.graphRadar, echart.graphRadar, [this.data.category_max, this.data.category_score]);
                echart.init_chart(this.graphStack, echart.graphStack, [this.data.category, this.data.cnt, data[6]]);
            }
        })
    },

    parseResult: function(res) {
        var cnt = new Array()
        for (var i = 1; i <= res[0]; i++) {
            cnt.push("第" + i + "次")
        }

        var category_max = new Array()
        var category_score = new Array()
        var category = new Array()

        res[5].forEach(element => {
            category.push(element.name)
            category_max.push({
                max: 10,
                name: element.name
            })
            for (var i = 0; i < res[5].length; i++) {
                if (res[4][i].name === element.name) {
                    category_score.push(element.value * 10 / (res[4][i].value * 3))
                    break
                }
            }

        });

        this.setData({
            cnt: cnt,
            category_max: category_max,
            category_score: [{
                value: category_score
            }],
            category: category,
        })
    },

});