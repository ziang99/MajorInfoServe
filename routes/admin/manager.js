var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../../module/db.js')

router
  // 用户查询
  .get('/', async (req, res, next) => {
    let sql = 'select * from zy_manager'
    let result = await db.base(sql)
    // console.log(result);
    if(!result || result.length === 0){
      res.json({ desc: '查询失败', code: 400 })
    }else{
      res.json({ data: result, desc: '查询成功', code: 200 })
    }
  })

  // 添加管理员
  .post('/', async (req, res, next) => {
    // console.log(req.body)
    let { username, password } = req.body
    if(req.body === {} || !req.body){
      res.json({ desc: '请求参数错误', code: 400 })
    }
    let sql1 = 'select * from zy_manager where username = ?'
    let result1 = await db.base(sql1, username)
    if(result1 && result1.length !== 0) {
      res.json({ desc: '该信息已存在', code: 412 })
    }else{
      let sql = 'insert into zy_manager (username, password) values (?, ?)'
      let data = [username, password]
      let res6 = await db.base(sql, data)
      // console.log(res6);
      // 返回数据
      if (res6.affectedRows === 1) {
        res.json({ desc: '请求成功', code: 200 })
      } else {
        res.json({ desc: '添加失败', code: 400 })
      }
    }
  })

  // 管理员删除
  .delete('/:id', async (req, res, next) => {
    // console.log(req.params)
    let { id } = req.params
    if(!id){
      res.json({ desc: '请求参数错误', code: 400 })
    }
    // 在管理员表中删除
    let sql = 'DELETE FROM zy_manager WHERE id = ?'
    let res2 = await db.base(sql, id)
    // 返回数据
    if (res2.affectedRows === 1) {
      res.json({ desc: '删除成功', code: 200 })
    } else {
      res.json({ desc: '删除失败', code: 400 })
    }
  })

  // 根据管理员id获取相应信息
  .get('/:id', async (req, res, next) => {
  // console.log(req.params)
  let { id } = req.params
  if(!id){
    res.json({ desc: '请求参数错误', code: 400 })
  }
  let sql = 'select * from zy_manager where id = ?'
  let res6 = await db.base(sql, id)
  // console.log(res6)
  // 返回数据
  if (res6[0].username) {
    res.json({ desc: '查询成功', data: res6[0], code: 200 })
  } else {
    res.json({ desc: '查询失败', code: 400 })
  }
})

  // 修改管理员
  .put('/', async (req, res, next) => {
    let { id, username, password } = req.body
    // console.log(req.body)
    let sql1 = 'select * from zy_manager where username = ?'
    let result1 = await db.base(sql1, username)
    if(result1 && result1.length !== 0) {
      res.json({ desc: '该信息已存在', code: 412 })
    }else{
      let sql = 'UPDATE zy_manager set username=?, password=? where id = ?'
      let data = [username, password, id]
      let res6 = await db.base(sql, data)
      // console.log(res6)
      // 返回数据
      if (res6.affectedRows === 1) {
        res.json({ desc: '修改成功', code: 200 })
      } else {
        res.json({ desc: '修改失败', code: 400 })
      }
    }
  })


module.exports = router;