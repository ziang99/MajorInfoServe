var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../../module/db.js')

router
  // 左侧菜单权限
  .get('/', async (req, res, next) => {
    // 获取一级菜单信息
    let sql1 = 'select id,name from zy_menus where level = 0'
    let resOne = await db.base(sql1)
    // 获取二级菜单信息
    let sql2 = 'select id,name,pid,path from zy_menus where level = 1'
    let resTwo = await db.base(sql2)
    resOne.forEach(item => {
      let arr = resTwo.filter(flag => {
        return flag.pid === item.id
      })
      item.childrens = arr
    })
    // console.log(resOne)
    // 返回数据
    if (resOne.length === 0 || !resOne) {
      res.json({ desc: '请求失败', code: 400 })
    } else {
      res.json({ data: resOne, desc: '请求成功', code: 200 })
    }
  })

module.exports = router;
