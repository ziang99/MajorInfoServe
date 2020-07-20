var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../../module/db.js')

router
  // 学院专业查询
  .get('/', async (req, res, next) => {
    // 获取学院信息
    let sql1 = 'select id,name from zy_title where level = 0'
    let resOne = await db.base(sql1)
    // 获取专业信息
    let sql2 = 'select id,name,pid from zy_title where level = 1'
    let resTwo = await db.base(sql2)
    resOne.forEach(item => {
      let arr = resTwo.filter(flag => {
        return flag.pid == item.id
      })
      item.childrens = arr
    })
    // console.log(resOne)
    // 返回数据
    if (resOne.length == 0 || !resOne) {
      res.json({ desc: '专业数据请求失败', code: 400 })
    } else {
      res.json({ data: resOne, desc: '请求成功', code: 200 })
    }
  })

  // 添加专业
  .post('/', async (req, res, next) => {
    // console.log(req.body)
    let { name, pid, level } = req.body
    if(req.body === {} || !req.body){
      res.json({ desc: '请求参数错误', code: 400 })
    }
    let sql1 = 'select * from zy_title where name = ?'
    let result1 = await db.base(sql1, name)
    if(result1 && result1.length !== 0) {
      res.json({ desc: '该信息已存在', code: 412 })
    }else{
      let sql = 'insert into zy_title (name, pid, level) values (?, ?, ?)'
      let data = [name, pid, level]
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

  // 根据专业id获取相应信息
  .get('/:id', async (req, res, next) => {
    // console.log(req.params)
    let { id } = req.params
    if(!id){
      res.json({ desc: '请求参数错误', code: 400 })
    }
    let sql = 'select * from zy_title where id = ?'
    let res6 = await db.base(sql, id)
    // console.log(res6)
    // 返回数据
    if (res6[0].name) {
      res.json({ desc: '查询成功', data: res6[0], code: 200 })
    } else {
      res.json({ desc: '查询失败', code: 400 })
    }
  })

  // 修改专业
  .put('/', async (req, res, next) => {
    let { id, name, pid, level } = req.body
    // console.log(req.body)
    let sql1 = 'select * from zy_title where name = ?'
    let result1 = await db.base(sql1, name)
    if(result1 && result1.length !== 0) {
      res.json({ desc: '该信息已存在', code: 412 })
    }else{
      let sql = 'UPDATE zy_title set name=?, pid=?, level=? where id = ?'
      let data = [name, pid, level, id]
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

  // 删除专业
  .delete('/:id', async (req, res, next) => {
    let { id } = req.params
    // console.log(req.params);
    if(!id){
      res.json({ desc: '请求参数错误', code: 400 })
    }
    let sql = 'DELETE FROM zy_title WHERE id = ?'
    let res6 = await db.base(sql, id)
    // console.log(res6)
    // 返回数据
    if (res6.affectedRows == 1) {
      res.json({ desc: '删除成功', code: 200 })
    } else {
      res.json({ desc: '删除失败', code: 400 })
    }
  })

module.exports = router;
