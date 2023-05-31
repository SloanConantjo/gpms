var express = require('express');
var router = express.Router();
var db = require('../mysql/sql.js');

// document = window.document;

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
      req.session.user = data[0];
      req.session.islogin = true;

      if (data[0].accLevel === 0)
        res.redirect('/admin');
      else if (data[0].accLevel === 1)
        res.redirect('/prof');
      else
        res.redirect('/stu');
    } else {
      res.render('',{error:true});
      // res.redirect('/');
      // res.end('failed');

    }
  });
})


module.exports = router;
