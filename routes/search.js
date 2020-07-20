var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../module/db.js')

// 获取所有专业资讯数据列表接口
router.get('/allinfo', async function(req, res, next) {
  let sql = "select id,news_name,news_introduce,news_logo from zy_news"
  let result = await db.base(sql)
  // console.log(result)
  
  if(result && result !== []){
    // 返回数据
    res.json({ 
      data: result,
      desc: { msg: '查询成功', status: 200 }
    })
  }else{
    res.json({
      msg: '查询失败', status: 400 
    })
  }
})


module.exports = router;