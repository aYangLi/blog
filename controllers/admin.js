const express = require('express');

const router =  express.Router();

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

router.get('/repass',(req, res) => {
  res.render('admin/repass', {})
  
})

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

module.exports = router;