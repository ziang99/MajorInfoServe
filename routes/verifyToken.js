var express = require('express');
var router = express.Router();
// 引入jwt token工具
const JwtUtil = require('../module/jwt.js');

router.use(function(req, res, next) {
  // 除了 /login 请求,其他的所有请求都需要进行token值校验
  if (req.url !== '/login' && req.url !== '/admin/login') {
    let token = req.headers.token;
    let jwt = new JwtUtil(token);
    let result = jwt.verifyToken();
    // 如果考验通过就next，否则就返回登陆信息不正确
    if (result == 'err') {
      console.log(result);
      res.json({ desc: { msg: '登录已过期,请重新登录', status: 400 } });
    } else {
      next();
    }
  } else {
    next();
  }
});

module.exports = router;
