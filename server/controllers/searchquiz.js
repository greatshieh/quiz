const DB = require('../utils/db.js')
module.exports = {
  //获取整个高校列表
  quiz: async ctx => {
    // 新的数组，准备接受生成的题目
    var quizList = new Array()
    var i = 1

    // 产生随机数，随机选择一道题
    while (i < 11) {
      var num = Math.random();
      var id = Math.ceil(num * 402);
      var location = quizList.indexOf(id)
      if (location == -1 && id < 402) {
        // 题目id没有出现过，并且在所有id中
        quizList.push(id)
        // ctx.state.data = ((await DB.query("SELECT * FROM quiz_list WHERE id = ?", [id]))[0])
        i += 1
      }
    }
    ctx.state.data = (await DB.query("SELECT * FROM quiz_list WHERE id IN (?)", [quizList]))
  }
}