var express = require('express');
var router = express.Router();
let stu = require('../controllers/student');
const multer = require('multer')

//文档上传
const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './public/documents');
    },
    filename(req, file, cb) {
      cb(null, req.params.id + file.originalname);
    }
  })
const upload = multer({ storage });

/* GET home page. */
router.get('/', stu.stuHome);

router.get('/topic', stu.stuTopic);

router.get('/topic/info/:id', stu.stuTopicInfo);
// router.post('/topic/info', stu.stuTopicInfo);

router.get('/topic/list', stu.stuTopicList);

router.get('/topic/select/:id', stu.stuTopicSelectGet);

router.post('/topic/select/:id', stu.stuTopicSelectPost);

router.get('/paper', stu.stuPaperList);

router.get('/paper/:id', stu.stuPaper);

router.post('/paper/new', stu.stuPaperNew);

router.post('/paper/:id', upload.single('file'), stu.stuPaperUpload);

router.get('/profile', stu.stuProfile);

router.post('/profile/:id', stu.stuProfilePost);

router.get('/defense', stu.stuDefense);

module.exports = router;
