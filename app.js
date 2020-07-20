var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// 解决跨域问题
var cors = require('cors');
app.use(cors());

// 引入路由
var verifyToken = require('./routes/verifyToken');
var loginRouter = require('./routes/login');
var userRouter = require('./routes/user');
var indexRouter = require('./routes/index');
var uploadRouter = require('./routes/upload');
var detailRouter = require('./routes/detail');
var collectRouter = require('./routes/collect');
var searchRouter = require('./routes/search');
var RegisterRouter = require('./routes/register');
// --------------------后台管理------------------------
let Login = require('./routes/admin/login.js');
let Menus = require('./routes/admin/menus.js');
let User = require('./routes/admin/user.js');
let Grade = require('./routes/admin/grade.js');
let Listdetail = require('./routes/admin/listdetail.js');
let ImgUploads = require('./routes/admin/upload.js');
let ImgUpdate = require('./routes/admin/update.js');
let Manager = require('./routes/admin/manager.js');
let Show = require('./routes/admin/show.js');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, './public')));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use(express.static(path.join(__dirname, './dist')))

app.use(verifyToken);
app.use('/login', loginRouter);
app.use('/userinfo', userRouter);
app.use('/index', indexRouter);
app.use('/upload', uploadRouter);
app.use('/detail', detailRouter);
app.use('/collect', collectRouter);
app.use('/search', searchRouter);
app.use('/register', RegisterRouter);
// ---------------------后台管理-----------------------
app.use('/admin/login', Login);
app.use('/admin/menus', Menus);
app.use('/admin/user', User);
app.use('/admin/grade', Grade);
app.use('/admin/listdetail', Listdetail);
app.use('/admin/image/upload', ImgUploads);
app.use('/admin/image/update', ImgUpdate);
app.use('/admin/manager', Manager);
app.use('/admin/show', Show);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
