var express = require('express');
var router = express.Router();
// 引入操作数据库通用api
const db = require('../../module/db.js')
// 引入jwt token工具
const JwtUtil = require('../../module/jwt.js');

// 登录api
router.post('/', async function(req, res, next) {
  // 获取前端传过来的登录数据
  let username = req.body.username
  let password = req.body.password
  // console.log(req.body)
  if(username == '' || password == ''){
    res.json({ msg: '用户名或密码不能为空', code: 401 })
  }else{
    // 查询数据
    let sql = 'select * from zy_manager where username = ? and password = ?'
    let data = [username, password]
    let result = await db.base(sql, data)
    // console.log(result)
    if(result.length === 0){
      res.json({ msg: '请检查用户名或密码', code: 400 })
    }else{
      // 登陆成功，添加token验证
      let id = result[0].id.toString();
      // 将用户id传入并生成token
      let jwt = new JwtUtil(id);
      let tokenStr = jwt.generateToken();
      // 将生成的token字符串添加到返回给前端的对象中
      result[0].token = tokenStr;
      // 返回数据
      res.json({ data: result[0],msg: '登录成功', code: 200 })
    }
  }
});

module.exports = router;