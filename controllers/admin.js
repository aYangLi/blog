const express = require('express');

const router =  express.Router();

router.get('/', (req, res) =>{
  res.render('admin/index');
});

router.get('/doc', (req, res) =>{
  res.send('我是后台文档页面');
});

router.get('/blog', (req, res) =>{
  res.send('我是后台博客页面');
});

module.exports = router;