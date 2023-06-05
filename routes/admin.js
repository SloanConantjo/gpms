var express = require('express');
var router = express.Router();
let admin = require('../controllers/admin');

/* GET home page. */
router.get('/', admin.adminHome)

router.get('/account', admin.adminAccount);

router.get('/topic', admin.adminTopic);

router.post('/account', admin.adminAddAccount);

router.delete('/account/:username', admin.adminDeleteAccount);

router.post('/account/like', admin.adminAccountLike);

router.post('/account/edit', admin.adminAccountEdit);

router.post('/topic/like', admin.adminTopicLike);
module.exports = router;
