var express = require('express');
var router = express.Router();
var db = require('../mysql/sql.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.post('/', function (req, res, next){
  var val = req.body;
  var userName = val.userName;
  var userPwd = val.userPwd;
  db.query('select * from account where userName = ? and password = ?',[userName, userPwd],function (err, data) {
    if (err) {
      throw err;
    } else if (data.length > 0) {
      req.session.user = req.body;
      req.session.islogin = true;
      res.redirect('/admin');
      // res.end('success');
      // res.render('admin');
    } else {
      // res.redirect('/admin');
      res.end('failed');
      // res.render('admin');
    }
  });
})


module.exports = router;
