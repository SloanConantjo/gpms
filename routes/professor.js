var express = require('express');
var router = express.Router();
let prof = require('../controllers/professor');

/* GET home page. */
router.get('/', prof.profHome);

router.get('/topic', prof.profTopic);

router.get('/students', prof.profStudents);

router.get('/paper', prof.profPaper);

router.get('/defense', prof.profDefense);

router.get('/profile', prof.profProfile);

router.post('/profile', prof.profProfilePost);

router.get('/topic/info', prof.profTopicInfo);

router.get('/topic/post', prof.profTopicPost);

module.exports = router;
