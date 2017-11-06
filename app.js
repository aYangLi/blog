const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');

// 专门负责session 的
const session = require('express-session');

const home = require('./controllers/home');
const admin = require('./controllers/admin');

const app = express();

app.listen(3000);

app.set('views', path.join(__dirname,'./views'));
app.set('view engine', 'xtpl');

app.use(express.static(path.join(__dirname,'./public')));

app.use(bodyParser.urlencoded({extended:false}));

// 如果简单在node 中解析session
// 如下代码足够
app.use(session({
  // cookie:''
  secret:'ayang',
  resave:false,
  saveUninitialized:false,
}));

// app.locals 是一个对象，此对象下数据可以在任意模板下被访问
app.locals.name = 'aYang';

app.use('/admin',function (req, res, next) {
  console.log(req.url);
  console.log(req.session);
  // 将登陆成功后的用户信息赋值给全局模板变量
  app.locals.logInfo = req.session.logInfo;

  if (!req.session.isLogin) {
    return res.redirect('/login');
  }

  next();

})

// 当访问 / 使用前台的路由
app.use('/',home);

// 当访问以 /admin开头。使用后台（admin）页面；
app.use('/admin',admin);