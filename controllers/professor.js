const db = require("../mysql/sql");

exports.profHome = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        db.query('select * from professor where userName = ?',
            [req.session.user.userName],function(err, results) {
                res.render('profHome', {title: 'profHome', error: err, data: results});
        });
    }
}

exports.profPaper = function(req, res) {
    res.render('profPaper', {title: 'profPaper'});
}

exports.profProfile = function(req, res) {
    res.render('profProfile', {title: 'profProfile'});
}

exports.profProfilePost = function(req, res) {
    console.log(req.body);
    res.redirect('/prof');
}

exports.profStudents = function(req, res) {
    res.render('profStudents', {title: 'profStudents'});
}

exports.profTopic = function(req, res) {
    res.render('profTopic', {title: 'profTopic'});
}

exports.profTopicInfo = function(req, res) {
    res.render('profTopicInfo', {title: 'profTopicInfo'});
}

exports.profTopicPost = function(req, res) {
    res.render('profTopicPost', {title: 'profTopicPost'});
}

exports.profDefense = function(req, res) {
    res.render('profDefense', {title: 'profDefense'});
}
