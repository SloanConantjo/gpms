var express = require('express');
var router = express.Router();
let admin = require('../controllers/admin');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/admin/acc');
  })

router.get('/acc', admin.adminAccount);

module.exports = router;
