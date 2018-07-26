const DB = require('../utils/db.js')
module.exports = {
    //获取整个高校列表
    quiz: async ctx => {

        /*
        随机选择题目，其中，
        国家认同 --> 10题，
        区域认同 --> 3题，
        科学技术 --> 7题，
        世界认识 --> 4题，
        社会常识 --> 4题，
        生活常识 --> 5题，
        自然地理 --> 3题，
        体音舞美 --> 4题，
        共40题 
        */

        var category = [{
                name: "国家认同",
                count: 10
            },
            {
                name: "区域认同",
                count: 3
            },
            {
                name: "科学技术",
                count: 7
            },
            {
                name: "世界认识",
                count: 4
            },
            {
                name: "社会常识",
                count: 4
            },
            {
                name: "生活常识",
                count: 5
            },
            {
                name: "自然地理",
                count: 3
            },
            {
                name: "体音舞美",
                count: 4
            }
        ]

        var search_result = new Array()

        var sql = "SELECT * FROM quiz_list WHERE id >= (SELECT floor( RAND() * ((SELECT MAX(id) FROM quiz_list WHERE category=?)-(SELECT MIN(id) FROM quiz_list  WHERE category=?)) + (SELECT MIN(id) FROM quiz_list  WHERE category=?)))ORDER BY id LIMIT ?"

        for (var i = 0; i < category.length; i++) {
            var data = (await DB.query(sql, [category[i].name, category[i].name, category[i].name, category[i].count]))
            data.forEach(res => {
                search_result.push(res)
            })
        }

        // 将试题随机排序
        // 接收乱序结果的Array
        var new_query = new Array()

        // 网上介绍的一种洗牌算法
        function shuffle(arr) {
            var i, j, temp;
            for (i = arr.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
            return arr;
        };

        var arr = new Array(40)
        for(var i=0;i<40;i++){
            arr[i] = i
        }

        var random_query = shuffle(arr)
        random_query.forEach(element =>{
            new_query.push(search_result[element])
        })

        // 返回查询结果
        ctx.state.data = [new_query, category]
    }
}