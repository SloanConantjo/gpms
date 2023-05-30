const connection = require("../mysql/sql");

exports.profHome = function(req, res) {
    res.render('profHome', {title: 'profHome'});
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
