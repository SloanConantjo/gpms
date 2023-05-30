var express = require('express');
var router = express.Router();
let stu = require('../controllers/student');

/* GET home page. */
router.get('/', stu.stuHome);

module.exports = router;
