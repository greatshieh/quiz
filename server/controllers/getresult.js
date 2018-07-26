const DB = require('../utils/db.js')
module.exports = {

    result: async ctx => {
        // 获取用户的openId
        let user = ctx.state.$wxInfo.userinfo.openId

        // 所有成绩集合
        var scoreList = new Array()

        // 最高分
        var max = 0

        // 最低分
        var min = 60

        // 每次考试的id号
        var quizID = new Array()

        // 从数据库获取用户测试成绩
        let result = (await DB.query("SELECT * FROM order_user WHERE user = ?", [user]))

        //解析所有的成绩
        result.forEach(element => {
            quizID.push(element.id)
            scoreList.push(element.total_score)
            if (element.total_score > max) {
                max = element.total_score
            }
            if (element.total_score < min) {
                min = element.total_score
            }
        })

        // 从数据库获取题目分类的总数
        let list = (await DB.query("SELECT category, COUNT(category) AS category_cnt,SUM(shoot) AS category_score FROM order_product WHERE order_id IN (?) GROUP BY category", [quizID]))

        let category_cnt = new Array()
        let category_score = new Array()

        let category_name = new Array()

        let sql = "SELECT order_id, SUM(shoot) AS total_score FROM order_product WHERE category = ? GROUP BY order_id"

        let series = new Array()

        list.forEach(element => {

            category_cnt.push({
                name: element.category,
                value: element.category_cnt
            })

            category_score.push({
                name: element.category,
                value: element.category_score
            })

            category_name.push(element.category)

        });

        for (let i = 0; i < category_name.length; i++) {
            let data = (await DB.query(sql, category_name[i]))

            let value = new Array()
            quizID.forEach(function(id, index, array) {
                data.forEach(element => {
                    if (element.order_id === id) {
                        value.push(element.total_score)
                    }
                })
                if (value.length < (index + 1)) {
                    value.push(0)
                }
            })
            //  组装展示需要的数据
            series.push({
                name: category_name[i],
                type: 'line',
                stack: '总分',
                itemStyle: {
                    normal: {
                        areaStyle: {
                            type: 'default'
                        }
                    }
                },
                data: value
            })
        }

        // 返回值
        ctx.state.data = [scoreList.length, max, min, scoreList, category_cnt, category_score, series]
    }
}