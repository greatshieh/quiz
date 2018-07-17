const DB = require('../utils/db.js')
module.exports = {
  //获取整个高校列表
  result: async ctx => {
    // 获取用户的openId

    let user = ctx.state.$wxInfo.userinfo.openId

    ctx.state.data = (await DB.query("SELECT * FROM order_user WHERE user = ?", [user]))
  }
}