var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../module/db.js')

// 获取轮播图数据接口
router.get('/banner', async function(req, res, next) {
  let sql = 'select id,news_logo from zy_news where news_banner = 1'
  let result = await db.base(sql)
  // 返回数据
  res.json({ 
    data: result,
    desc: { msg: '轮播查询成功', status: 200 }
  })
})

// 获取nav导航数据接口
router.get('/nav', async function(req, res, next) {
  // 获取学院信息
  let sql1 = 'select id,name from zy_title where level = 0'
  let resOne = await db.base(sql1)
  // 获取专业信息
  let sql2 = 'select id,name,pid from zy_title where level = 1'
  let resTwo = await db.base(sql2)
  resOne.forEach((item) => {
    let arr = resTwo.filter((flag) => {
      return flag.pid == item.id
    })
    item.childrens = arr
  })
  // 返回数据
  res.json({ 
    data: resOne,
    desc: { msg: '导航查询成功', status: 200 }
  })
})

// 获取所有专业资讯数据列表接口
router.get('/major', async function(req, res, next) {
  let page = req.query.page
  let sql = "select * from zy_news LIMIT ?,?"
  let data = [0, page*6]
  let result = await db.base(sql, data)
  
  let sqls = "select count(*) from zy_news"
  let results = await db.base(sqls)
  
  // 返回数据
  res.json({ 
    data: result,
    total: results[0]['count(*)'],
    desc: { msg: '列表查询成功', status: 200 }
  })
})

// 获取指定专业信息列表接口
router.get('/major/:id', async function(req, res, next) {
  let pid = req.params.id
  let sql = 'select * from zy_news where news_title_id = ?'
  let data = [pid]
  let result = await db.base(sql ,data)
  if(result && result !== []){
    // 返回数据
    res.json({ 
      data: result,
      desc: { msg: '专业信息查询成功', status: 200 }
    })
  }else{
    res.json({
      msg: '查询失败', status: 400
    })
  }
})


module.exports = router;
