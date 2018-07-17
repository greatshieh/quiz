const qcloud = require('../../vendor/wafer2-client-sdk/index')
const config = require('../../config.js')

var app = getApp()
var result = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  none: 'null'
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '', //题目
    quizList: [], //从服务器获得的所有题目
    option: [], //选项列表
    start: true, //规则说明页面
    style: '单选题', //题目类型
    answer: '', //选择的答案
    id: 'none', //选择答案的id
    score: 0, //题目的分数
    cnt: 0, //题目计数，并作为题目出现的索引
    max_cnt: 10,
    description: ['1. 壹贰叁肆伍陆柒捌玖拾壹贰叁肆伍陆柒捌玖拾', '2. 壹贰叁肆伍陆柒捌玖拾', '3. 壹贰叁肆伍陆柒捌玖拾', '4. 壹贰叁肆伍陆柒捌玖拾壹贰叁肆伍陆柒捌玖拾壹贰叁肆伍陆柒捌玖拾', '5. 壹贰叁肆伍陆柒捌玖拾壹贰叁肆伍陆柒捌玖拾'],
    answerList: []
    // std_answer: ''
  },

  // 开始挑战
  begin() {
    this.setData({
      start: false
    })

    this.chooseTopic(this.data.cnt)
  },

  //退出挑战，返回首页
  quit() {
    this.setData({
      quizList: []
    })
    wx.navigateTo({
      url: '../home/home',
    })
  },

  chooseTopic(cnt) {
    var data = this.data.quizList[cnt]

    var temp = data.options.replace("[", "")

    temp = temp.replace("]", "")

    var options = temp.split(",")

    this.setData({
      title: data.title,
      option: options,
      cnt: cnt,
      // lFlag: true,
      // std_answer: data.answer,
      score: data.scort
    })
  },

  //选择下一题
  next() {
    var max_cnt = this.data.max_cnt
    var cnt = this.data.cnt

    //判断答案是否正确
    this.calcScore()

    if (cnt < max_cnt - 1) {
      cnt++
      this.chooseTopic(cnt)
    } else {
      //上传成绩到服务器
      this.uploadresult()

      //重定向到提交结果页面
      wx.redirectTo({
        url: '../result/result',
      })
    }

  },

  // 上传成绩到服务器
  uploadresult() {
    wx.showLoading({
      title: '计算成绩...',
    })

    console.log(this.data.answerList)
    qcloud.request({
      url: config.service.uploadReuslt,
      login: true,
      method: 'POST',
      data: {
        list: this.data.answerList
      },
      success: result => {
        wx.hideLoading()
        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '成绩计算成功',
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '成绩计算失败',
          })
        }
      },
      fail: () => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '成绩计算失败',
        })
      }
    })
  },


  // 答案选择,获取用户选择的单选框的值
  radioChange: function(e) {
    var arr = this.data.option
    var item = e.detail.value

    this.setData({
      answer: e.detail.value, //选择的答案
      id: arr.indexOf(item) //选择答案的索引
    })
  },

  // 计算总分
  calcScore() {
    var data = this.data.quizList
    var cnt = this.data.cnt
    var choosed_id = this.data.id

    //保存选择的答案到quizList   
    var id = "answerList[" + cnt +"].id"
    var choosed = "answerList[" + cnt + "].choosed"

    this.setData({
      [id]: data[cnt].id,
      [choosed]: result[choosed_id]
    })

    // 记录分数
    if (result[choosed_id] === data[cnt].answer) {
      //结果正确
      app.data.total_score += data[cnt].scort
    }
  },

  getQuiz() {
    // 加载题目
    wx.showLoading({
      title: '加载题目',
    })

    //发送请求，获得所有题目
    qcloud.request({
      url: config.service.getQuiz,
      success: result => {
        wx.hideLoading()
        let data = result.data.data

        this.setData({
          quizList: data,
        })

        //获得从服务器得到的题目id
        var temp = new Array()
        var topicList = this.data.quizList

        topicList.forEach(function(element) {
          temp.push(element.id)
        })

        this.setData({
          idList: temp
        })
      },

      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '题目列表加载错误',
        })
        this.setDataP({
          lFlag: true,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    app.data.total_score = 0
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