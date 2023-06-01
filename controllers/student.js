const db = require("../mysql/sql");
const moment = require('moment');
// const Busboy = require('busboy');
const path = require('path');
const fs = require('fs');
const multer = require('multer')

const upload = multer({ dest: './public/documents' });

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
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        let topicQuery = 'select * from topic,student ' + 
            'where student.userName = ? '+ 
            'AND student.topicId = topic.topicId;';
        let paperQuery = 'select * from paper,(select student.stuNum as stuNum, student.userName '+
            'from topic, student where '+
            'student.topicId = topic.topicId and student.userName = ?)as stu '+
            'where stu.stuNum = paper.stuNum ' +
            'order by paper.uploadDate desc limit 1;';
        let topicResult, paperResult;
        db.query(topicQuery,[req.session.user.userName],
            function(err, results) {
                topicResult = results;
                console.log(results);
            });
        db.query(paperQuery,[req.session.user.userName], 
            function(err, results) {
                paperResult = results;
                console.log(results);
                res.render('stuTopic', {topic: topicResult, paper: paperResult});
            });
    }
}

exports.stuPaperList = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        let paperQuery = 'select * from paper,(select student.stuNum as stuNum, student.userName '+
        ', student.stuName from topic, student where '+
        'student.topicId = topic.topicId and student.userName = ?)as stu '+
        'where stu.stuNum = paper.stuNum ' +
        'order by paper.uploadDate desc;';
        db.query(paperQuery,[req.session.user.userName], 
            function(err, results) {
                res.render('stuPaperList', {papers: results, moment: moment, userName: req.session.user.userName});
            });
    }
}

exports.stuPaper = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        let paperQuery = 'select * from paper where paperId = ?;';
        db.query(paperQuery,[req.params.id], 
            function(err, results) {
                res.render('stuPaper', {paper: results, moment: moment, userName: req.session.user.userName});
            });
    }
}

exports.stuPaperNew = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        console.log(req.body);
        let stuQuery = 'select stuNum from student where userName = ?';
        let paperQuery = 'insert into paper(paperName,stuNum) value(?,?);';
        db.query(stuQuery, [req.session.user.userName],function(err, results) {
            db.query(paperQuery, [req.body.paper, results[0].stuNum],function(err, results) {
                db.query('select @@IDENTITY;', function(err, results) {
                    res.redirect('/stu/paper/'+results[0]['@@IDENTITY'])
                });
            });
        });
    }
}

exports.stuPaperUpload = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        let paperQuery = 'update paper set paperPath = ?,uploadDate = curdate() where paperId = ?';
        db.query(paperQuery, ['/documents/' + req.file.filename, req.params.id],function(err, results) {});
        res.redirect('/stu/paper')
    }
}

exports.stuProfile = function(req, res) {
    res.render('stuProfile', {title: 'stuProfile'});
}

exports.stuTopicInfo = function(req, res) {
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
    }
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
            res.render('stuTopicList', {title: '选题列表', error: err, data: results, moment: moment});
        });
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
        let stuQuery = 'update student set topicId = ? where stuNum = ?';
        let topicQuery = 'update topic set state = 1 where topicId = ?'
        console.log(req.body);
        for(let i = 0; req.body['stuNum'+i] !== undefined; i++) {
            db.query(stuQuery, [req.params.id, req.body['stuNum'+i]],function(err, results) {});
        }
        db.query(topicQuery, [req.params.id],function(err, results) {});
        res.redirect('/stu/topic');
    }
}

exports.stuDefense = function(req, res) {
    res.render('stuDefense', {title: 'stuDefense'});
}

