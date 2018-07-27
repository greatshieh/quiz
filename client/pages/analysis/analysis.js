var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
import * as echarts from '../../ec-canvas/echarts.js'

var util = require('../../utils/echarts.js')

const app = getApp()

var scoreList = new Array()

var lineGraph = null
var pieGraph = null
var radarGraph = null
var stackGraph = null
var searchData = new Array()

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
        ecLine: {
            onInit: function(canvas, width, height) {
                lineGraph = echarts.init(canvas, null, {
                    width: width,
                    height: height
                });
                canvas.setChart(lineGraph);
                return lineGraph;
            }
        },
        ecPie: {
            onInit: function(canvas, width, height) {
                pieGraph = echarts.init(canvas, null, {
                    width: width,
                    height: height
                });
                canvas.setChart(pieGraph);
                return pieGraph;
            }
        },
        ecRadar: {
            onInit: function(canvas, width, height) {
                radarGraph = echarts.init(canvas, null, {
                    width: width,
                    height: height
                });
                canvas.setChart(radarGraph);
                return radarGraph;
            }
        },
        ecStack: {
            onInit: function(canvas, width, height) {
                stackGraph = echarts.init(canvas, null, {
                    width: width,
                    height: height
                });
                canvas.setChart(stackGraph);
                return stackGraph;
            }
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

                searchData = data

                lineGraph.setOption(this.lineOption())
                pieGraph.setOption(this.pieOption())
                radarGraph.setOption(this.radarOption())
                stackGraph.setOption(this.stackOption())
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

    lineOption: function() {
        return util.graphLine(["成绩趋势图", this.data.cnt, searchData[3]])
    },

    pieOption: function() {
        return util.graphCycle([searchData[4]])
    },

    radarOption: function() {
        return util.graphRadar([this.data.category_max, this.data.category_score])
    },

    stackOption: function() {
        return util.graphStack([this.data.category, this.data.cnt, searchData[6]])
    }
});