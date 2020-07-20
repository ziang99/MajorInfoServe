var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../../module/db.js')
const fs = require('fs')

router
  // 资讯查询
  .get('/', async (req, res, next) => {
    let sql = 'select news_title_id from zy_news'
    let result = await db.base(sql)
    let arr = result.map(v => v.news_title_id)
    let sql1 = "select id,name from zy_title where FIND_IN_SET(id, ?)"
    let data1 = arr.toString()
    let result1 = await db.base(sql1, data1)
    if(!result1 || result1.length === 0){
      res.json({ desc: '所属专业名称查询失败', code: 400 })
    }
    // 分页
    // console.log(req.query)
    let { query, pagenum, pagesize } = req.query
    let num = Number(pagenum)
    let size = Number(pagesize)
    let num1 = (num - 1) * size
    let num2 = size
    let sql2 = "select * from zy_news LIMIT ?, ?"
    let data2 = [num1, num2]
    // console.log(data2)
    let result2 = await db.base(sql2, data2)
    // console.log(result2)
    // 获得总条数
    let sql3 = 'select * from zy_news'
    let result3 = await db.base(sql3)
    result2.forEach((item1) => {
      result1.forEach((item2) => {
        if(item1.news_title_id === item2.id){
          item1.news_title_id = item2.name
        }
      })
    })
    // console.log(result2)
    // 判断用户的输入情况
    if(query) {
      let str = `%${query}%`
      let sqls = 'select * from zy_news where news_name like ?'
      let results = await db.base(sqls, str)
      // console.log(results)
      // ctx.body = { data: results, desc: '搜索成功', code: 201 }
      let arr = results.map(v => v.news_title_id)
      let sql1 = "select id,name from zy_title where FIND_IN_SET(id, ?)"
      let data1 = arr.toString()
      let result1 = await db.base(sql1, data1)
      if(!result1 || result1.length === 0){
        res.json({ desc: '所属专业名称查询失败', code: 400 })
      }
      results.forEach((item1) => {
        result1.forEach((item2) => {
          if(item1.news_title_id === item2.id){
            item1.news_title_id = item2.name
          }
        })
      })
      if(!results || results.length === 0){
        res.json({ desc: '查询失败', code: 400 })
      }else{
        res.json({ data: results, total: results.length, desc: '查询成功', code: 200 })
      }
    }else{
      if(!result2 || result2.length == 0){
        res.json({ desc: '请求失败', code: 400 })
      }else{
        res.json({ data: result2, total: result3.length, desc: '请求成功', code: 200 })
      }
    }
  })

  // 父级类目信息
  .get('/category', async (req, res, next) => {
    // 获取类目信息
    let sql1 = "select id,name from zy_title where level = 1";
    let resOne = await db.base(sql1);
    // console.log(resOne)
    // 返回数据
    if (resOne.length == 0 || !resOne) {
      res.json({ desc: "请求失败", code: 400 })
    } else {
      res.json({ data: resOne, desc: "请求成功", code: 200 })
    }
  })

  // 添加信息详情
  .post('/', async (req, res, next) => {
    // console.log(req.body)
    let { news_name,news_introduce,news_logo,news_title_id,news_banner,likenum,islike,collect } = req.body
    if(req.body === {} || !req.body){
      res.json({ desc: '请求参数错误', code: 400 })
    }
    let sql6 = 'select id from zy_title where name = ?'
    let res6 = await db.base(sql6, news_title_id)
    // console.log(res6[0].id);
    let sql1 = 'insert into zy_news values (null, ?, ?, ?, ?, ?, ?, ?, ?)'
    let data1 = [news_name,news_introduce,news_logo,res6[0].id,news_banner,likenum,islike,collect]
    let res1 = await db.base(sql1, data1)
    // console.log(res1);
    // 返回数据
    if (res1.affectedRows === 1) {
      res.json({ desc: '添加成功', code: 200 })
    } else {
      res.json({ desc: '添加失败', code: 400 })
    }
  })

    // 根据id获取相应信息
  .get('/:id', async (req, res, next) => {
    // console.log(req.params)
    let { id } = req.params
    if(!id){
      res.json({ desc: '请求参数错误', code: 400 })
    }
    let sql = 'select news_title_id from zy_news where id = ?'
    let res6 = await db.base(sql, id)
    // console.log(res6[0].news_title_id)
    let sql1 = 'select name from zy_title where id = ?'
    let res1 = await db.base(sql1, res6[0].news_title_id)
    // console.log(res1)
    let sql3 = 'select * from zy_news where id = ?'
    let res3 = await db.base(sql3, id)
    res3[0].news_title_id = res1[0].name
    // console.log(res3[0])
    let sql4 = 'select name from zy_title where level = 1'
    let res4 = await db.base(sql4)
    // 返回数据
    if (res3[0].news_name) {
      res.json({ desc: '查询成功', data: res3[0], category: res4, code: 200 })
    } else {
      res.json({ desc: '查询失败', code: 400 })
    }
  })

  // 信息修改
  .put('/', async (req, res, next) => {
    // console.log(req.body)
    let { id,news_name,news_introduce,news_logo,news_title_id,news_banner,likenum,islike,collect } = req.body
    if(req.body === {} || !req.body){
      res.json({ desc: '请求参数错误', code: 400 })
    }
    let sql6 = 'select id from zy_title where name = ?'
    let res6 = await db.base(sql6, news_title_id)
    // console.log(res6)
    news_title_id = res6[0].id
    let sql1 = 'UPDATE zy_news set news_name=?,news_introduce=?,news_logo=?,news_title_id=?,news_banner=?,likenum=?,islike=?,collect=? where id = ?'
    let data1 = [news_name,news_introduce,news_logo,news_title_id,news_banner,likenum,islike,collect, id]
    let res1 = await db.base(sql1, data1)
    // console.log(res1);
    // 返回数据
    if (res1.affectedRows === 1) {
      res.json({ desc: '修改成功', code: 200 })
    } else {
      res.json({ desc: '修改失败', code: 400 })
    }
  })

  // 信息删除
  .delete('/:id', async (req, res, next) => {
    let { id } = req.params
    if(!id){
      res.json({ desc: '请求参数错误', code: 400 })
    }
    let sql1 = 'select news_logo FROM zy_news WHERE id = ?'
    let res1 = await db.base(sql1, id)
    // console.log(res1[0].news_logo)
    let newUrl = res1[0].news_logo.substring(1)
    // console.log(newUrl)
    fs.unlink(newUrl, (err) => {
      if(err){
        console.log(err);
        return;
      }
      // console.log('图片删除成功');
    })

    let sql2 = 'DELETE FROM zy_news WHERE id = ?'
    let res2 = await db.base(sql2, id)
    // console.log(res2)
    // 返回数据
    if (res2.affectedRows === 1) {
      res.json({ desc: '删除成功', code: 200 })
    } else {
      res.json({ desc: '删除失败', code: 400 })
    }
  })


module.exports = router;
