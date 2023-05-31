var express = require('express');
var router = express.Router();
let admin = require('../controllers/admin');

/* GET home page. */
router.get('/', admin.adminHome)

router.get('/account', admin.adminAccount);

router.get('/topic', admin.adminTopic);
module.exports = router;
