var express = require('express');
var router = express.Router();
let prof = require('../controllers/professor');
const admin = require("../controllers/admin");

/* GET home page. */
router.get('/', prof.profHome);

router.get('/topic', prof.profTopic);

router.delete('/topic/:topicId', prof.profDeleteTopic);

router.get('/students', prof.profStudents);

router.get('/paper', prof.profPaper);

router.get('/defense', prof.profDefense);

router.get('/profile', prof.profProfile);

router.post('/profile', prof.profProfileEdit);

router.post('/profile/editcontact', prof.profProfileEditContact);

router.post('/profile/editpassword', prof.profProfileEditPassword);

router.get('/topic/info', prof.profTopicInfo);

router.get('/topic/post', prof.profTopicPost);

router.post('/topic/post', prof.profTopicPostSuccess);
module.exports = router;
