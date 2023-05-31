const db = require("../mysql/sql");
const moment = require('moment');

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
    // console.log(req.params.id);
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        let topicQuery = 'select topic.topicId, topic.topicName, topic.profile as tProfile,'+
        'topic.postDate, professor.profName, professor.profile as pProfile, professor.email, '+
        'professor.phoneNum, professor.profCollege from topic,professor '+
        'where topic.profNum = professor.profNum AND topic.topicId = ?';
        let stuQuery = 'select topicId from student where userName = ?';
        let topicSelected = false;

        db.query(stuQuery, [req.session.user.userName], function(err, results) {
            if(results.length>0)
            {
                console.log(results[0].topicId);
                if(results[0].topicId !== null)
                    topicSelected = true;
            }
    });

        db.query(topicQuery, [req.params.id],function(err, results) {
                console.log(topicSelected);
                res.render('stuTopicInfo', {error: err, data: results, selected:topicSelected});
        });
        // res.render('adminHome', {title: 'adminHome'});
    }
    // res.render('stuTopicInfo', {title: 'stuTopicInfo'});
}

exports.stuTopicList = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        db.query('select * from topic,professor where topic.profNum = professor.profNum AND topic.state = 0',function(err, results) {
            // console.log(typeof(results[0].postDate));    
            res.render('stuTopicList', {title: '选题列表', error: err, data: results, moment: moment});
        });
        // res.render('adminHome', {title: 'adminHome'});
    }
}

exports.stuTopicSelectGet = function(req, res) {

    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        let topicQuery = 'select topicId, topicName from topic where topicId = ?';

        db.query(topicQuery, [req.params.id],function(err, results) {
                res.render('stuTopicSelect', {error: err, data: results});
        });
    }
}

exports.stuTopicSelectPost = function(req, res) {

    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        let topicQuery = 'update student set topicId = ? where stuNum = ?';
        console.log(req.body);
        for(let i = 0; req.body['stuNum'+i] !== undefined; i++) {
            // console.log(req.params.id);
            // console.log(req.body['stuNum'+i]);
            db.query(topicQuery, [req.params.id, req.body['stuNum'+i]],function(err, results) {});
        }
        // res.send('<script>alert("Success");</script>');
        res.redirect('/stu/topic');
    }
}

exports.stuDefense = function(req, res) {
    res.render('stuDefense', {title: 'stuDefense'});
}

