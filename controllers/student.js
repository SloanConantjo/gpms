const db = require("../mysql/sql");
const moment = require('moment');
const async = require('async');

exports.stuHome = function(req, res) {
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
        let defQuery = 'select * from defense,student where defense.topicId = student.topicId AND student.userName = ?';
        let daysLeft;

        async.parallel({
            topic: function(callback) {
                db.query(topicQuery,[req.session.user.userName],callback);
            },
            paper: function(callback) {
                db.query(paperQuery,[req.session.user.userName],callback);
            },
            defense: function(callback) {
                db.query(defQuery,[req.session.user.userName],callback);
            }
        }, 
        
        function(err, results) {
            //计算剩余天数
            if(results.defense[0].length === 1)
            {
                let dateNow = new Date();
                daysLeft = Math.ceil(((results.defense[0][0].defDate - dateNow)/(1000 * 60 * 60 * 24)));
            }
            else if(results.defense[0].length === 2)
            {
                let dateNow = new Date();
                daysLeft = Math.ceil(((results.defense[0][1].defDate - dateNow)/(1000 * 60 * 60 * 24)));
            }

            res.render('stuHome', {error: err, defense: results.defense[0], moment: moment, 
                daysLeft: daysLeft, topic: results.topic[0], paper: results.paper[0]});
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
            
        async.parallel({
            topic: function(callback) {
                db.query(topicQuery,[req.session.user.userName],callback);
            },
            paper: function(callback) {
                db.query(paperQuery,[req.session.user.userName],callback);
            }
        }, 
        
        function(err, results) {
            // console.log(results.topic[0]);
            res.render('stuTopic', {error: err, topic: results.topic[0], paper: results.paper[0]});
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
                res.render('stuPaperList', {error: err, papers: results, moment: moment, userName: req.session.user.userName});
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
                res.render('stuPaper', {error: err, paper: results, moment: moment, userName: req.session.user.userName});
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
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        accQuery = 'select * from student, account '+
        'where student.userName = account.userName and account.userName = ?';
        db.query(accQuery, [req.session.user.userName], function(err, results) {
            res.render('stuProfile', {error: err, profile: results, moment: moment});
        });
    }
}

exports.stuProfilePost = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        if(req.params.id === '0')
        {
            db.query('update student set phoneNum= ?, email= ? where userName = ?', 
            [req.body.phone, req.body.email, req.session.user.userName], function(){});

            res.redirect('/');    
        }
        else if(req.params.id === '1')
        {
            accQuery = 'select * from student, account '+
            'where student.userName = account.userName and account.userName = ?';
            
            db.query(accQuery, [req.session.user.userName], function(err, results) {
                if(req.body.password0 !== results[0].password)
                {
                    res.redirect('stu/profile');
                }
                else
                {
                    db.query('update account set password = ? where userName = ?', 
                        [req.body.password1, req.session.user.userName], function(){});
                    res.redirect('/');    
                }
            });
        }
    }
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

        async.parallel({
            stu: function(callback) {
                db.query(stuQuery, [req.session.user.userName],callback);
            },
            topic: function(callback) {
                db.query(topicQuery, [req.params.id],callback);
            }
        }, 
        
        function(err, results) {
            if(results.stu[0].length>0)
            {
                if(results.stu[0][0].topicId !== null)
                    topicSelected = true;
            }
            res.render('stuTopicInfo', {error: err, data: results.topic[0], selected:topicSelected});
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
        let success = true;

        db.beginTransaction(function(err) {

            let funcAry = [];

            for(let i = 0; req.body['stuNum'+i] !== undefined; i++) 
            {
                let func = function (callback){
                        db.query(stuQuery, [req.params.id, req.body['stuNum'+i]],function(err, results) {
                        if(err || !results)
                        {
                            db.rollback();
                            success = false;
                        }
                        else if(results.affectedRows === 0)
                        {
                            db.rollback();
                            success = false;
                        }
                        return callback(err, results);
                    });
                };

                funcAry.push(func);
    
                if(!success)
                    break;
                
            }
            
            async.parallel(funcAry, function (err, result) {
                if (err)
                {
                    db.rollback();
                }
                else if (success)
                {
                    db.commit();
                }
                res.redirect('/stu/topic');
            });
        });
    }
}

exports.stuDefense = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 2){
        res.status(403).send('Forbidden');
    }
    else
    {
        db.query('select * from defense,student where defense.topicId = student.topicId AND student.userName = ?', 
        [req.session.user.userName],function(err, results) {
            let daysLeft;
            if(results.length === 1)
            {
                let dateNow = new Date();
                daysLeft = Math.ceil(((results[0].defDate - dateNow)/(1000 * 60 * 60 * 24)));
            }
            else if(results.length === 2)
            {
                let dateNow = new Date();
                daysLeft = Math.ceil(((results[1].defDate - dateNow)/(1000 * 60 * 60 * 24)));
            }
            res.render('stuDefense', {error: err, defense: results, moment: moment, daysLeft: daysLeft});
        });
    }
}

