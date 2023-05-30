var express = require('express');
var router = express.Router();
let prof = require('../controllers/professor');

/* GET home page. */
router.get('/', prof.profHome);

module.exports = router;
