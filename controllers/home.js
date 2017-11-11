const express = require('express');

const router =  express.Router();

const md5 = require('md5');

const posts = require('../models/posts');

// 用户模型
const users = require('../models/users');

router.get('/', (req, res) =>{
  // res.send('我是前台页面');
  let query = 'SELECT * FROM `posts` WHERE status=0';
  posts.find(query,[], (err, result)=>{
    if (err) return console.log(err);
    console.log(result);
    res.render('home/index', {posts:result});
  })

});

router.get('/register', (req, res) =>{
  res.render('home/register', {});
});

router.get('/login', (req, res) =>{
  res.render('home/login', {});
});

router.post('/register',(req, res) => {
  // console.log(req.body);
  let query = 'INSERT INTO `users` set ?';
  users.insert(query, req.body, (err, data) => {
     if (err) return console.log(err);
     
     res.json({
      code:10000,
      msg:'ok',
      result:{}
    })
  });
})

// 处理登陆
router.post('/login',(req, res) =>{
  // console.log(req.body);
  // 以提交上来的邮箱地址作为查询条件
  // 可以查到对应的密码
  // 比如邮箱 xiaoming@.qq.com
  // SELECT `pass` FROM `users` WHERE `email` = `xiaoming@.qq.com`
  let query = 'SELECT `pass`, `name`, `avatar`, `id` FROM `users` WHERE ?'
  users.find(query, {email:req.body.email}, (err,result) => {
    if (err) return console.log(err);

    // console.log(result);
    let isLogin = result[0].pass == md5(req.body.pass)? true:false;
    if (isLogin){
//    记录登陆者信息，记录在session中
      req.session.logInfo = {
        id:result[0].id,
        name:result[0].name,
        avatar:result[0].avatar,
      }
      // 存一个session
      req.session.isLogin = isLogin;
      res.json({
        code:10000,
        msg:'ok',
        result:{}
      })
    }else{
      res.json({
        code:10001,
        msg:'用户名或密码错误',
        result:{},
      })
    }
  });
})

// 渲染关于我们
router.get('/about', (req, res) => {
  res.render('home/about', {})
})

// 渲染加入我们
router.get('/join', (req, res) => {
  res.render('home/join', {})
})

// 渲染文章页面
router.get('/article/:id', (req, res) => {
  // SQL语句
  let query = 'SELECT * FROM `posts` WHERE ?';

  posts.find(query, {id: req.params.id}, (err, result) => {
      if(err) return console.log(err);
      
      res.render('home/article', {post: result[0]});
  });
})

// 退出登陆
router.post('/logout', (req, res) => {
  req.session.isLogin = false;
  req.session.logInfo = null;
  // res.redirect('/');
  res.json({
    code:10000,
    msg:'退出登陆成功',
    result:{},
  })
})

module.exports = router;