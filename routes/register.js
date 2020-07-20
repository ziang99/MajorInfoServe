var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../module/db.js')

// 注册
router.put('/', async function(req, res, next) {
  // 获取前端传过来的注册数据
  // console.log(req.body)
  let { username, password, confirmPwd } = req.body
  // 先将用户想要注册的学号去数据库查询，如果能查询到说明已存在该用户了，查询不到才允许注册
  let sql1 = 'select id, username from zy_user where username = ?'
  let result1 = await db.base(sql1, username)
  // console.log(result1)
  if(result1 && result1.length !== 0) {
    res.json({ desc: '该用户已存在', code: 412 })
  }else{
    let sql = 'INSERT INTO zy_user (id, username, password) VALUES (null, ?, ?)';
    let data = [username, password]
    let result = await db.base(sql, data)
    // console.log(result.insertId)
    let sql2 = 'INSERT INTO zy_userinfo (id, pid, headimg, nickname, gender, phone, showtext) VALUES (null, ?, ?, ?, ?, ?, ?)';
    let data2 = [result.insertId, '', '', '', '', '']
    let result2 = await db.base(sql2, data2)
    // console.log(result2)
    if(result.affectedRows === 1, result2.affectedRows === 1){
      res.json({ desc: '注册成功', code: 200 })
    }else{
      res.json({ desc: '注册失败', code: 400 })
    } 
  }
})


module.exports = router;
