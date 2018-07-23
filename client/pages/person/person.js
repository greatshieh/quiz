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
    answer: '', //选择的答案
    score: 0, //题目的分数
    cnt: 0, //题目计数，并作为题目出现的索引
    max_cnt: 10, //测试题目数量
    description: ['1. 壹贰叁肆伍陆柒捌玖拾壹贰叁肆伍陆柒捌玖拾', '2. 壹贰叁肆伍陆柒捌玖拾', '3. 壹贰叁肆伍陆柒捌玖拾', '4. 壹贰叁肆伍陆柒捌玖拾壹贰叁肆伍陆柒捌玖拾壹贰叁肆伍陆柒捌玖拾', '5. 壹贰叁肆伍陆柒捌玖拾壹贰叁肆伍陆柒捌玖拾'], //测试规则
    answerList: new Array(10), //所有选择的答案
    second: 100, //计时器初始值
    restart: false,
  },

  // 开始挑战
  begin() {
    this.setData({
      start: false
    })

    // 选择题目
    this.chooseTopic(this.data.cnt)

    // 启动计时器
    Countdown(this)

    // 背景音乐设置
    const backgroundAudioManager = wx.getBackgroundAudioManager()

    // 背景音乐链接, 设置了 src 之后会自动播放
    backgroundAudioManager.src = 'http://dl.stream.qqmusic.qq.com/C400003MM10C2vVBYS.m4a?vkey=4FD695E1F630382A27C58522D1C768EEF27BFC86C83A5386BD0F374A65CDD2E7CC22316043F4349CB8247B73EA280126CA5E602D8845ED95&guid=1577361444&uin=20322475&fromtag=66'
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

  // 选择题目
  chooseTopic(cnt) {
    var data = this.data.quizList[cnt]

    var temp = data.options.replace("[", "")

    temp = temp.replace("]", "")

    var radioItem = temp.split(",")

    var options = new Array()

    var i = 0
    radioItem.forEach(function(element) {
      options.push({
        name: result[i],
        value: element,
      })
      i++
    })

    this.setData({
      title: data.title,
      option: options,
      cnt: cnt,
      second: 100,
      score: data.scort
    })

    var answer = {}
    answer['answerList[' + cnt + '].topic_id'] = data.id
    answer['answerList[' + cnt + '].choosed_answer'] = null
    answer['answerList[' + cnt + '].shoot'] = 0
    this.setData(answer)
  },

  //选择下一题
  next(event) {
    var max_cnt = this.data.max_cnt
    var cnt = this.data.cnt

    //判断答案是否正确并计算得分
    this.calcScore()

    // 题目循环
    if (cnt < max_cnt - 1) {
      // 没有达到最大测试数量

      // 题目计数+1
      cnt++

      if (this.data.restart) {
        //没有点击动作发生，计时器自动重启，重置restart为false
        this.setData({
          restart: false,
          second: 100
        })
      }

      if (event) {
        //  点击动作发生，重启计时器

        // 重置计时器
        this.setData({
          second: 100
        })
        // 清除计时器
        clearTimeout(timer)
      }

      // 启动计时器
      Countdown(this)

      // 选择题目
      this.chooseTopic(cnt)

    } else {
      //测试完成，关闭计时器
      clearTimeout(timer)
      console.log(this.data.answerList)
      //上传成绩到服务器
      this.uploadresult()
    }

  },

  // 上传成绩到服务器
  uploadresult() {
    wx.showLoading({
      title: '正在提交成绩...',
      mask: true,
    })
    console.log(this.data.answerList)
    qcloud.request({
      url: config.service.uploadReuslt,
      login: true,
      method: 'POST',
      data: {
        list: [this.data.answerList, app.data.total_score]
      },
      success: result => {
        wx.redirectTo({
          url: '../result/result',
        })
      },
      fail: () => {
        wx.hideLoading()
        wx.showModal({
          title: '没有授权',
          content: '你没有授权我们使用你的用户信息，因此无法记录挑战成绩。请返回重试。',
          showCancel:false,
          confirmText:'返回首页',
          complete: (res)=>{
            wx.redirectTo({
              url: '../home/home',
            })
          }
        })
      }
    })
  },


  // 答案选择,获取用户选择的单选框的值
  radioChange: function(e) {
    var checked = e.detail.value
    var changed = {}
    var arr = this.data.option
    var cnt = this.data.cnt

    var answer = 'answerList[' + cnt + '].choosed_answer'

    for (var i = 0; i < arr.length; i++) {
      if (checked.indexOf(arr[i].value) !== -1) {

        changed['option[' + i + '].checked'] = true

        // 保存选择的答案到answerList
        this.setData({
          [answer]: arr[i].name
        })

      } else {
        changed['option[' + i + '].checked'] = false
      }
      this.setData(changed)

    }
  },

  // 计算总分
  calcScore() {
    var data = this.data.quizList
    var cnt = this.data.cnt

    var checked = this.data.answerList[cnt].choosed_answer

    var answer = 'answerList[' + cnt + '].shoot'

    // 记录分数
    if (checked === data[cnt].answer) {
      //结果正确
      app.data.total_score += data[cnt].scort
      this.setData({
        [answer]: data[cnt].scort
      })
    }
  },

  getQuiz() {
    // 加载题目
    wx.showLoading({
      title: '加载题目',
      mask: true,
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
      },

      fail: () => {
        wx.hideLoading()
        wx.showToast({
          title: '题目列表加载错误',
        })
        this.setData({
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
});


var timer;

function Countdown(that) {
  var second = that.data.second

  if (second == 0) {
    //自动重启
    that.setData({
      restart: true
    })
    that.next()
  } else {
    timer = setTimeout(function() {
      that.setData({
        second: second - 1
      })
      Countdown(that)
    }, 1000)
  }
};