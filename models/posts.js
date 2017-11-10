const db = require('../config/db');

// 增
exports.insert = function (query, body, cb) {
  
  
    db.query(query, body, cb);
  }
  // 删
  exports.delete = function () {
  
  }
  
  // 改
  exports.update = function (query, opt, cb) {
     db.query(query, opt, cb) 
  } 
  
  // 查
  exports.findAll = function (cb) {
    let query = 'SELECT * FROM `posts`';
    db.query(query,cb);
  }

  // 查
  exports.find = (query, opts, cb) => {
    db.query(query, opts, cb);
  } 