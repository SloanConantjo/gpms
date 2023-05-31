const connection = require("../mysql/sql");
const db = require("../mysql/sql");

exports.stuHome = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        db.query('select * from student where userName = ?',
            [req.session.user.userName],function(err, results) {
                res.render('stuHome', {title: 'stuHome', error: err, data: results});
            });
    }
}

exports.stuTopic = function(req, res) {
    res.render('stuTopic', {title: 'stuTopic'});
}

exports.stuPaper = function(req, res) {
    res.render('stuPaper', {title: 'stuPaper'});
}

exports.stuProfile = function(req, res) {
    res.render('stuProfile', {title: 'stuProfile'});
}

exports.stuTopicInfo = function(req, res) {
    res.render('stuTopicInfo', {title: 'stuTopicInfo'});
}

exports.stuTopicList = function(req, res) {
    res.render('stuTopicList', {title: 'stuTopicList'});
}

exports.stuTopicSelect = function(req, res) {
    res.render('stuTopicSelect', {title: 'stuTopicSelect'});
}

exports.stuDefense = function(req, res) {
    res.render('stuDefense', {title: 'stuDefense'});
}

