var express = require('express');
var router = express.Router();
var db = require('../mysql/sql.js');
var fs = require('fs');
var json = require('../public/documents/visits.json');
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
      today = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
      fs.readFile('./public/documents/visits.json', 'utf-8', (err, data) => {
        if (err) throw err;
        else {
          var json = JSON.parse(data);
          index = json.data.length;
          if (index === 0) {
            json.data[index] = [today, 1];
            fs.writeFile('./public/documents/visits.json', JSON.stringify(json), err => {
              if (err) throw err;
            })
          }
          else {
            if (json.data[index-1][0] === today) {
              json.data.splice(index-1, 1, [today, json.data[index-1][1]+1]);
              fs.writeFile('./public/documents/visits.json', JSON.stringify(json), err => {
                if (err) throw err;
              })
            }
            else {
              json.data[index] = [today, 1];
              fs.writeFile('./public/documents/visits.json', JSON.stringify(json), err => {
                if (err) throw err;
              })
            }
          }
        }
      })
      if (data[0].accLevel === 0)
        res.redirect('/admin');
      else if (data[0].accLevel === 1)
        res.redirect('/prof');
      else
        res.redirect('/stu');
      console.log(data[0])
    } else {
      res.render('',{error:true});
    }
  });
})
module.exports = router;
