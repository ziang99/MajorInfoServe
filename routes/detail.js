var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../module/db.js')

// 获取详情页数据接口
router.get('/:id', async function(req, res, next) {
  let pid = req.params.id
  let sql = 'select news_name,news_introduce,news_logo from zy_news where id = ?'
  let data = [pid]
  let result = await db.base(sql, data)
  
  let sqld = 'select * from zy_details where pid = ?'
  let datad = [pid]
  let resultd = await db.base(sqld, datad)
  
  if(result && result !== [] && resultd && resultd !== []){
    // 返回数据
    res.json({ 
      pdata: result[0],
      data: resultd,
      desc: { msg: '详情内容查询成功', status: 200 }
    })
  }else{
    res.json({
      msg: '详情内容查询失败', status: 400
    })
  }
})

// 获取点赞数数据接口
router.get('/like/:id', async function(req, res, next) {
  let pid = req.params.id
  let sql = 'select likenum, islike from zy_news where id = ?'
  let data = [pid]
  let result = await db.base(sql, data)
  
  if(result && result !== []){
    // 返回数据
    res.json({
      data: result[0],
      desc: { msg: '查询成功', status: 200 }
    })
  }else{
    res.json({
      msg: '查询失败', status: 400
    })
  }
})

// 添加点赞数数据接口
router.put('/like/add', async function(req, res, next) {
  let addNum = req.body.addNum
  let pid = req.body.pid
  let sql = 'UPDATE zy_news set likenum = ?, islike = 1 where id = ?'
  let data = [addNum, pid]
  let result = await db.base(sql, data)
  
  if(result && result.affectedRows == 1){
    // 返回数据
    res.json({
      msg: '修改成功', status: 200
    })
  }else{
    res.json({
      msg: '修改失败', status: 400
    })
  }
})

// 取消点赞数数据接口
router.put('/like/reduce', async function(req, res, next) {
  let addNum = req.body.addNum
  let pid = req.body.pid
  let sql = 'UPDATE zy_news set likenum = ?, islike = 0 where id = ?'
  let data = [addNum, pid]
  let result = await db.base(sql, data)
  
  if(result && result.affectedRows == 1){
    // 返回数据
    res.json({
      msg: '修改成功', status: 200
    })
  }else{
    res.json({
      msg: '修改失败', status: 400
    })
  }
})

// 获取收藏状态接口
router.get('/collect/:id', async function(req, res, next) {
  let pid = req.params.id
  let sql = 'select collect from zy_news where id = ?'
  let data = [pid]
  let result = await db.base(sql, data)
  
  if(result && result !== []){
    // 返回数据
    res.json({
      data: result[0],
      desc: { msg: '查询成功', status: 200 }
    })
  }else{
    res.json({
      msg: '查询失败', status: 400
    })
  }
})

// 添加收藏接口
router.post('/collect/add', async function(req, res, next) {
  // 先根据id获得被收藏的信息数据
  let pid = req.body.pid
  let sql = 'select news_name, news_introduce, news_logo from zy_news where id = ?'
  let data = [pid]
  let result = await db.base(sql, data)
  // console.log(result)
  // 再把数据添加到收藏的数据表中
  let userid = req.body.userid
  let sqlr = 'insert into zy_collect (img, title, content, pid, user) values (?, ?, ?, ?, ?)'
  let datar = [result[0].news_logo, result[0].news_name, result[0].news_introduce, pid, userid]
  let resultr = await db.base(sqlr, datar)
  // console.log(resultr)
  // 成功之后修改被收藏信息的collect字段为1
  let sql1 = 'UPDATE zy_news set collect = 1 where id = ?'
  let data1 = [pid]
  let result1 = await db.base(sql1, data1)
  
  if(resultr && resultr.affectedRows == 1 && result1 && result1.affectedRows == 1){
    // 返回数据
    res.json({
      msg: '收藏成功', status: 200
    })
  }else{
    res.json({
      msg: '收藏失败', status: 400
    })
  }
})

// 取消收藏接口
router.put('/collect/cancel', async function(req, res, next) {
  // 先根据被取消收藏的信息id修改该信息的collect字段
  let fid = req.body.pid
  let sql = 'UPDATE zy_news set collect = 0 where id = ?'
  let data = [fid]
  let result = await db.base(sql, data)
  // 然后在删除zy_collect表中的数据
  let userid = req.body.userid
  let sqld = 'DELETE FROM zy_collect WHERE pid = ? and user = ?'
  let datad = [fid, userid]
  let resultd = await db.base(sqld, datad)

  if(result && result.affectedRows == 1 && resultd && resultd.affectedRows == 1){
    // 返回数据
    res.json({
      msg: '修改成功', status: 200
    })
  }else{
    res.json({
      msg: '修改失败', status: 400
    })
  }
})


module.exports = router;