var express = require('express');
var router = express.Router();
let stu = require('../controllers/student');

/* GET home page. */
router.get('/', stu.stuHome);

router.get('/topic', stu.stuTopic);

router.get('/topic/info', stu.stuTopicInfo);

router.get('/topic/list', stu.stuTopicList);

router.get('/topic/select', stu.stuTopicSelect);

router.get('/paper', stu.stuPaper);

router.get('/profile', stu.stuProfile);

router.get('/defense', stu.stuDefense);

module.exports = router;
