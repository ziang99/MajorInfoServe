var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../../module/db.js')

router
  // 用户查询
  .get('/', async (req, res, next) => {
    let sql = 'select * from zy_user'
    let result = await db.base(sql)
    // console.log(result);
    if(!result || result.length === 0){
      res.json({ desc: '查询失败', code: 400 })
    }else{
      res.json({ data: result, desc: '查询成功', code: 200 })
    }
  })

  // 用户删除
  .delete('/:id', async (req, res, next) => {
    // console.log(req.params)
    let { id } = req.params
    if(!id){
      res.json({ desc: '请求参数错误', code: 400 })
    }
    // 在用户表中删除
    let sql = 'DELETE FROM zy_user WHERE id = ?'
    let res2 = await db.base(sql, id)
    // 在用户信息表中删除
    let sql1 = 'DELETE FROM zy_userinfo WHERE pid = ?'
    let res1 = await db.base(sql1, id)
    // 返回数据
    if (res2.affectedRows === 1 && res1.affectedRows === 1) {
      res.json({ desc: '删除成功', code: 200 })
    } else {
      res.json({ desc: '删除失败', code: 400 })
    }
  })

  // 用户详细信息查询
  .get('/info', async (req, res, next) => {
    let sql = 'select * from zy_userinfo'
    let result = await db.base(sql)
    // console.log(result);
    let sql1 = 'select id,username from zy_user'
    let result1 = await db.base(sql1)
    // console.log(result1);
    for(const i of result) {
      for(const j of result1){
        if(i.pid === j.id) {
          i.username = j.username
        }
      }
    }
    if(!result || result.length === 0){
      res.json({ desc: '查询失败', code: 400 })
    }else{
      res.json({ data: result, desc: '查询成功', code: 200 })
    }
  })


module.exports = router;
