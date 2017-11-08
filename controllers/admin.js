const express = require('express');

const router =  express.Router();

const path = require('path');

const md5 = require('md5');

const users = require('../models/users');

const multer = require('multer');

// 配置上传目录及文件名
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/avatar')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// 配置
const upload = multer({
  storage
});

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

router.post('/upload',upload.single('avatar'), (req, res) => {
  // 通过 req.file 可以获得上传后的文件信息
  // console.log(req.file);
  // 将上传后的图片路径写入数据库
  let query = 'UPDATE `users` SET ? WHERE ?'
  users.update(query,[{avatar:req.file.path},{id:req.session.logInfo.id}], (err, result) => {
    
    if (err) return console.log(err);

    res.json({
      code:10000,
      msg:'ok',
      result:{
        path:req.file.path
      }
    })
  })
})


module.exports = router;