const DB = require('../utils/db.js')
module.exports = {
  //获取整个高校列表
  quiz: async ctx => {

    // 产生随机数，随机选择一道题
    do{
    var num = Math.random();
    var id = Math.ceil(num * 402);
    }while(id>401)
    console.log(id)
    ctx.state.data = (await DB.query("SELECT * FROM quiz_list WHERE id = ?", [id]))[0]
  }
}