const express = require('express');

const router =  express.Router();

const md5 = require('md5');

const users = require('../models/users');

router.get('/', (req, res) =>{
  res.render('admin/index',{});
});

router.get('/settings', (req, res) =>{
  let query = 'SELECT * FROM `users` WHERE ?'
  // console.log(req.session.logInfo.id);
  users.find(query, {id:req.session.logInfo.id}, (err, result) => {
    if (err) return console.log(err);

    res.render('admin/settings', {info:result[0]})
  })
  // res.render('admin/settings',{});
});
router.post('/settings', (req, res) =>{
  //  console.log(req.body)
  let query = 'UPDATE `users` SET ? WHERE ?';

  users.update(query, [req.body, {id:req.session.logInfo.id}], function (err, result) {
    if (err) return console.log(err);
    res.json({
      code:10000,
      msg:'ok',
      result:{}
    })
  })

});

router.get('/repass',(req, res) => {
  res.render('admin/repass', {})
  
})


router.post('/repass',(req, res) => {
  
  // 通过id来查找密码是否正确；
  let findStr = 'SELECT `pass` FROM `users` WHERE ?'

  users.find(findStr,{id:req.session.logInfo.id}, (err, result) => {
    if (err) return console.log(err);
    if (result[0].pass != md5(req.body.pass)) {
      res.json({
        code:20000,
        msg:'原密码错误',
        result:{},
      })
      return;
    } else {
      // 更新修改密码
      let updateStr = 'UPDATE `users` SET ? WHERE ?'
      users.update(updateStr, [{pass:md5(req.body.newpass)}, {id:req.session.logInfo.id}], (err, result) => {
        if (err) return console.log(err);
        res.json({
          code:10000,
          msg:'密码修改成功',
          result:{},
        })
      })
    }
  })
  
})


module.exports = router;