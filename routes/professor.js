var express = require('express');
var router = express.Router();
let prof = require('../controllers/professor');
const admin = require("../controllers/admin");

/* GET home page. */
router.get('/', prof.profHome);


//profTopic
router.get('/topic', prof.profTopic);

router.post('/topic/edit_topic', prof.profTopicEdit);

router.delete('/topic/:topicId', prof.profDeleteTopic);

router.get('/topic/post', prof.profTopicPost);

router.post('/topic/post', prof.profTopicPostSuccess);

router.get('/topic/info', prof.profTopicInfo);//


//profProflie
router.get('/profile', prof.profProfile);

router.post('/profile', prof.profProfileEdit);

router.post('/profile/editcontact', prof.profProfileEditContact);

router.post('/profile/editpassword', prof.profProfileEditPassword);


//profStudents
router.get('/students', prof.profStudents);//主页

router.get('/students/:stuNum', prof.profGradeStuPage);//每个学生的评分页

router.post('/students/:stuNum', prof.profGradeStu);//提交给学生的评分

//profPaper
router.get('/paper', prof.profPaper);


//profDefense
router.get('/defense', prof.profDefense);

router.post('/defense/new', prof.profPostDefense);


module.exports = router;
