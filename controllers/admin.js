const express = require('express');

const router =  express.Router();

router.get('/', (req, res) =>{
  res.render('admin/index',{});
});

router.get('/settings', (req, res) =>{
  res.render('admin/settings',{});
});

router.get('/blog', (req, res) =>{
  res.send('我是后台博客页面');
});

module.exports = router;