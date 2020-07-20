var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../../module/db.js')

router
  // 柱状图
  .get('/bar', async (req, res, next) => {
    // 软件学院资讯的点赞总数
    let sql1 = "select likenum from zy_news where news_title_id=8 or news_title_id=9 or news_title_id=10 or news_title_id=11"
    let arr1 = await db.base(sql1)
    let strNum1 = 0
    for (const i of arr1) {
      strNum1 += i.likenum 
    }
    // console.log(strNum1)
    // 艺术与传媒学院资讯的点赞总数
    let sql2 = "select likenum from zy_news where news_title_id=12 or news_title_id=13"
    let arr2 = await db.base(sql2)
    let strNum2 = 0
    for (const i of arr2) {
      strNum2 += i.likenum 
    }
    // console.log(strNum2)
    // 会计学院资讯的点赞总数
    let sql3 = "select likenum from zy_news where news_title_id=14 or news_title_id=15 or news_title_id=16 or news_title_id=17 or news_title_id=18"
    let arr3 = await db.base(sql3)
    let strNum3 = 0
    for (const i of arr3) {
      strNum3 += i.likenum 
    }
    // console.log(strNum3)
    // 经济管理学院资讯的点赞总数
    let sql4 = "select likenum from zy_news where news_title_id=38 or news_title_id=39 or news_title_id=40"
    let arr4 = await db.base(sql4)
    let strNum4 = 0
    for (const i of arr4) {
      strNum4 += i.likenum 
    }
    // console.log(strNum4)
    // 信息技术学院资讯的点赞总数
    let sql5 = "select likenum from zy_news where news_title_id=41 or news_title_id=42 or news_title_id=43 or news_title_id=44"
    let arr5 = await db.base(sql5)
    let strNum5 = 0
    for (const i of arr5) {
      strNum5 += i.likenum 
    }
    // console.log(strNum5)
    let Arr = [strNum1, strNum2, strNum3, strNum4, strNum5]
    // 返回数据
    if(Arr.length !== 0){
      res.json({ desc: '请求成功', data: Arr, code: 200 })
    }else{
      res.json({ desc: '专请求失败', code: 400 })
    }
  })



module.exports = router;