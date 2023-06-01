var express = require('express');
var router = express.Router();
let admin = require('../controllers/admin');

/* GET home page. */
router.get('/', admin.adminHome)

router.get('/account', admin.adminAccount);

router.get('/topic', admin.adminTopic);

router.post('/account', admin.adminAddAccount);

router.delete('/account/:username', admin.adminDeleteAccount);
module.exports = router;
