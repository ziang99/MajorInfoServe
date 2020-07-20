var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../module/db.js')

// 获取收藏列表接口
router.get('/', async function(req, res, next) {
  let userid = req.query.userid
  let sql = 'select * from zy_collect where user = ?'
  let data = [userid]
  let result = await db.base(sql, data)
  
  if(result && result !== []){
    // 返回数据
    res.json({
      data: result,
      desc: {msg: '获取成功', status: 200}
    })
  }else{
    res.json({
      msg: '获取失败', status: 400
    })
  }
})




module.exports = router;











