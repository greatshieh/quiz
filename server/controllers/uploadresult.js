// 保存用户答题情况到数据库，包括两张表
// 一张是用户测试表，包括用户的openid，题目id和答题时间

const DB = require('../utils/db.js')
module.exports = {
  //获取整个高校列表
  add: async ctx => {

    //获取用户openid
    let user = ctx.state.$wxInfo.userinfo.openId
    let topicList = ctx.request.body.list || []

    // 插入答题表至 user 表
    let order = await DB.query('insert into order_user(user) values (?)', [user])

    // 插入订单至 order_product 表
    // 从插入user表返回的数据中获取此次答题的id
    let orderId = order.insertId
    let sql = 'INSERT INTO order_product (order_id, topic_id, choosed_answer) VALUES '

    // 插入时所需要的数据和参数
    let query = []
    let param = []

    topicList.forEach(element => {

      query.push('(?, ?, ?)')
      //     param.push([orderId, element.id, element.choosed])
      param.push(orderId)
      param.push(element.id)
      param.push(element.choosed)
    })

    await DB.query(sql + query.join(', '), param)

    ctx.state.data = {}
  }
}