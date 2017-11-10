const express = require('express');

const router =  express.Router();

const path = require('path');

const md5 = require('md5');

const posts = require('../models/posts');
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

// 渲染修改密码页面
router.get('/repass',(req, res) => {
  res.render('admin/repass', {})
  
})

// 渲染添加文章页面
router.get('/add',(req, res) => {
  res.render('admin/post', {})
})

// 渲染编辑文章
router.get('/edit/:id',(req, res) => {
// SQL语句
let query = 'SELECT * FROM `posts` WHERE ?';
console.log(req.params);
posts.find(query, req.params, (err, result) => {
  if(err) return console.log(err);
  console.log(result);
  res.render('admin/post', {post: result[0]});
});

})
// 渲染添加文章列表
router.get('/list',(req, res) => {
  
  // posts.findAll((err,data) =>{
  //   if(err) return console.log(err);
  //   console.log(data);
  //   res.render('admin/list', {posts:data})
  // })

  // 加上查询条件

  // 查询文章（状态不为0）
  let query = 'SELECT * FROM `posts` WHERE ?';
  
  posts.find(query, {status: 0}, (err, data) => {
      if(err) return console.log(err);

      res.render('admin/list', {posts: data});
  });

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

// 添加文章
router.post('/post', (req, res) => {
  // console.log(req.body);

  // 文章作者
  req.body.uid = req.session.logInfo.id;
  // 添加时间
  req.body.time = new Date();

  req.body.status = 0;

  // 如果是添加操作 则没有 id
  // 如果是编辑操作 则有 id

  let query;

  // 修改
  // 修改数据库
  if(req.body.id) { // 编辑

      let id = req.body.id;
      delete req.body.id;

      query = 'UPDATE `posts` SET ? WHERE id=' + id;

      posts.update(query, req.body, (err, result) => {
          if(err) return console.log(err);

          res.json({
              code: 10000,
              msg: 'OK',
              result: {}
          });
      });

      return;
  }

  // 添加
  query = 'INSERT INTO `posts` SET ?';

  // 插入数据库
  posts.insert(query, req.body, (err, result) => {
      if(err) return console.log(err);
      // 响应浏览器结果
      res.json({
          code: 10000,
          msg: 'OK',
          result: {}
      });
  });
})

// 删除文章
router.post('/delete', (req, res) => {
  
      // 更改文章状态
      let query = 'UPDATE `posts` SET ? WHERE ?';
  
      posts.update(query, [{status: 1}, {id: req.body.id}], (err, result) => {
          if(err) return console.log(err);
  
          res.json({
              code: 10000,
              msg: 'OK',
              result: {}
          })
      });
  })


module.exports = router;