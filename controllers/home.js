const express = require('express');

const router =  express.Router();

const md5 = require('md5');

// 用户模型
const users = require('../models/users');

router.get('/', (req, res) =>{
  // res.send('我是前台页面');
  res.render('home/index', {});
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

router.post('/login',(req, res) =>{
  // console.log(req.body);
  // 以提交上来的邮箱地址作为查询条件
  // 可以查到对应的密码
  // 比如邮箱 xiaoming@.qq.com
  // SELECT `pass` FROM `users` WHERE `email` = `xiaoming@.qq.com`
  let query = 'SELECT `pass` FROM `users` WHERE ?'
  users.find(query, {email:req.body.email}, (err,result) => {
    if (err) return console.log(err);

    // console.log(result);
    let isLogin = result[0].pass == md5(req.body.pass)? true:false;
    if (isLogin){
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

module.exports = router;