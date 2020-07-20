var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../module/db.js')

// 获取用户信息接口
router.get('/:id', async function(req, res, next) {
  let sql = 'select * from zy_userinfo where pid = ? '
  let data = req.params.id
  let result = await db.base(sql, data)
  // 返回数据
  res.json({ 
    data: result[0],
    desc: { msg: '用户信息查询成功', status: 200 }
  })
});

// 修改昵称接口
router.put('/:id/nickname', async function(req, res, next) {
  // console.log(req.params)
  // console.log(req.body)
  let sql = 'update zy_userinfo set nickname = ? where pid = ?'
  let data = [req.body.nickname, req.params.id]
  let result = await db.base(sql, data)
  // 返回数据
  res.json({ 
    data: result[0],
    desc: { msg: '昵称修改成功', status: 200 }
  })
});

// 修改性别接口
router.put('/:id/gender', async function(req, res, next) {
  // console.log(req.params)
  // console.log(req.body)
  let sql = 'update zy_userinfo set gender = ? where pid = ?'
  let data = [req.body.gender, req.params.id]
  let result = await db.base(sql, data)
  // 返回数据
  res.json({ 
    data: result[0],
    desc: { msg: '性别修改成功', status: 200 }
  })
});

// 修改电话接口
router.put('/:id/phone', async function(req, res, next) {
  // console.log(req.params)
  // console.log(req.body)
  let sql = 'update zy_userinfo set phone = ? where pid = ?'
  let data = [req.body.phone, req.params.id]
  let result = await db.base(sql, data)
  // 返回数据
  res.json({ 
    data: result[0],
    desc: { msg: '电话修改成功', status: 200 }
  })
});

// 修改个性签名接口
router.put('/:id/showtext', async function(req, res, next) {
  // console.log(req.params)
  // console.log(req.body)
  let sql = 'update zy_userinfo set showtext = ? where pid = ?'
  let data = [req.body.showtext, req.params.id]
  let result = await db.base(sql, data)
  // 返回数据
  res.json({ 
    data: result[0],
    desc: { msg: '个性签名修改成功', status: 200 }
  })
});

module.exports = router;










