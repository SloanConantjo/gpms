const db = require("../mysql/sql");
const moment = require('moment');
const async = require('async');


//profHome
exports.profHome = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        db.query('select profNum FROM professor WHERE userName = ? LIMIT 1', [req.session.user.userName], function (err, result) {
            if (err)
                throw err;
            if(result) {
                let topicQuery = 'select count(*) as topics from topic WHERE profNum = ? AND state != 2';
                let defensQuery = 'select defense.defId as defId, DATE_FORMAT(defense.defDate, \'%Y-%m-%d %H:%i:%s\') as defDate,' +
                    ' defense.defAddress as defAddress from defense, topic WHERE defense.defDate > now() AND defense.topicId = topic.topicId' +
                    ' AND topic.profNum = ? ORDER BY defense.defDate LIMIT 1';
                let paperQuery = 'select count(paper.paperId) as papers from paper, student, topic WHERE paper.grades is NULL AND' +
                    ' paper.stuNum = student.stuNum AND student.topicId = topic.topicId AND topic.profNum = ?';
                async.parallel({
                    topic: function(callback) {
                        db.query(topicQuery,[result[0].profNum],callback);
                    },
                    defense: function(callback) {
                        db.query(defensQuery,[result[0].profNum],callback);
                    },
                    paper: function(callback) {
                        db.query(paperQuery,[result[0].profNum],callback);
                    }
                },

                function(err, results) {
                    console.log("yes1");
                    console.log(results.topic[0]);
                    console.log("yes2");
                    console.log(results.defense[0]);
                    console.log("yes3");
                    console.log(results.paper[0]);
                    console.log("yes4");
                    res.render('profHome', {error: err, topic: results.topic[0], defense: results.defense[0], paper: results.paper[0], moment: moment});
                });
            }
        });
    }
}



//profTopic
exports.profTopic = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        var username = req.session.user.userName;
        db.query('SELECT profNum FROM professor WHERE userName = ?', [username], function(err, result) {
            if (err) throw err;
            var profNum = result[0].profNum;
            var query = 'SELECT DATE_FORMAT(topic.postDate, \'%Y-%m-%d\') AS Date, topic.*, GROUP_CONCAT(student.stuNum) AS stuNumList ' +
                'FROM topic LEFT JOIN student ON topic.topicId = student.topicId WHERE topic.profNum = ? GROUP BY topic.topicId';
            db.query(query, [profNum], function(err, result1) {
                if (err) {
                    throw err;
                }
                res.render('profTopic', {data: result1});
            });
        });
    }
}

exports.profTopicEdit = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        var topicId = req.body.topicId;
        var profile = req.body.topic_profile;
        var grade = req.body.topic_grades;
        if (grade.length > 0) {
            db.query('UPDATE topic SET profile = ?, grades = ? WHERE topicId = ?', [profile, grade, topicId],function(err) {
                if (err) throw err;
                res.redirect('/prof/topic');
            });
        }
        else {
            db.query('UPDATE topic SET profile = ? WHERE topicId = ?', [profile, topicId],function(err) {
                if (err) throw err;
                res.redirect('/prof/topic');
            });
        }
    }
}

exports.profDeleteTopic = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        const topicId = req.params.topicId;
        db.query('DELETE FROM topic WHERE topicId = ? ', [topicId], function(err) {
            if (err) {
                throw err;
            } else {
                res.status(200).send('topic deleted');
            }
        });
    }
}

exports.profTopicPost = function(req, res) {
    res.render('profTopicPost', {title: 'profTopicPost'});
}
exports.profTopicPostSuccess = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        var username = req.session.user.userName;
        var topic_name = req.body.topic_name;
        var topic_profile = req.body.topic_profile;
        db.query('SELECT profNum FROM professor WHERE userName = ?', [username], function(err, result) {
            if (err) throw err;
            db.query('INSERT INTO topic(topicName, profile, profNum) VALUES (?, ?, ?)',
                [topic_name, topic_profile, result[0].profNum], function(err) {
                    if (err) throw err;
                    res.redirect('/prof/topic');
                });
        });
    }
}



//profProflie
exports.profProfile = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        accQuery = 'select * from professor, account '+
            'where professor.userName = account.userName and account.userName = ?';
        db.query(accQuery, [req.session.user.userName], function(err, results) {
            if (err) throw err;
            res.render('profProfile', {profile: results, moment: moment});
        });
    }
}

exports.profProfileEdit = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        db.query('SELECT * FROM professor WHERE userName = ?', [req.session.user.userName], function(err, results) {
            if (err) throw err;
            console.log(results[0].profNum);
            db.query('UPDATE professor SET profile = ? WHERE profNum = ?', [req.body.prof_profile, results[0].profNum], function(err, results1) {
                if (err) throw err;
                res.redirect('/prof/profile');
            });
        });
    }
}

exports.profProfileEditContact = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        var NewNumber = req.body.phoneNum;
        var Email = req.body.email;
        db.query('UPDATE professor SET phoneNum = ?, email = ? WHERE userName = ?',
            [NewNumber, Email, req.session.user.userName],function(err) {
                if (err) throw err;
                res.redirect('/prof/profile');
            });
    }
}

exports.profProfileEditPassword = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        var Oldpassword = req.body.oldpassword;
        var Newpassword = req.body.newpassword;
        db.query('SELECT * FROM account where userName = ? AND password = ?', [req.session.user.userName, Oldpassword],
            function (err, results) {
                if (err) throw err;
                if (results.length > 0) {
                    db.query('UPDATE account SET password = ? WHERE userName = ?',
                        [Newpassword, req.session.user.userName],function(err) {
                            if (err) throw err;
                            res.status(200).send('Password Changed');
                        });
                }
                else {
                    res.status(400).send('Old Password is fault!');
                }
            });
    }
}



//profStudents
exports.profStudents = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else {
        var curUser = req.session.user.userName;
        db.query('select profNum from Professor where userName=?', [curUser], function (err, result1) {
            if (err) throw err;
            var curProfNum = result1[0].profNum;
            var query =
                'select Student.*,Topic.topicName as topicName from Student,Topic ' +
                'where Student.topicId = Topic.topicId and Student.topicId in '+ 
                '(select Topic.topicId from Professor, Topic ' +
                'where Professor.profNum=Topic.profNum and Professor.profNum=?)'
            db.query(query, [curProfNum], function (err, result2) {
                if (err) throw err;
                res.render('profStudents', { data: result2 });
            });
        });
    }
}

exports.profGradeStuPage = function (req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else {
        var curStuNum = req.params.stuNum;
        var query1 =
            'select Student.stuNum,Student.stuName,Student.stuGrade,Topic.topicName, '+
            'Topic.topicId,Topic.Grades as topicGrade,Paper.grades as paperGrade,Paper.paperId ' +
            'from (Student left outer join Topic on Student.topicId=Topic.topicId) left outer join ' +
            'Paper on Student.stuNum=Paper.stuNum where Student.stuNum=? order by Paper.uploadDate DESC';
        db.query(query1, [curStuNum], function (err, result1) {
            if (err) throw err;
            var curTopicId = result1[0].topicId;
            var query2 = 'select finalGrades from Defense where Defense.topicId =? order by defDate';
            db.query(query2, [curTopicId], function (err, result2) {
                if (err) throw err;
                res.render('profGradeStu', { data: result1, defense: result2 });
            });
        });
    }
}

exports.profGradeStu = function (req, res) {//not test
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else {
        var curStuNum = req.params.stuNum;
        var stuGrade = req.body.stuGrade;
        db.query('update Student set stuGrade=? where stuNum=?',
            [stuGrade, curStuNum], function (err, result) {
                if (err) throw err;
                res.redirect(curStuNum);
        });
    }
}


//profPaper
exports.profPaper = function (req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else {
        var curUser = req.session.user.userName;
        db.query('select profNum from Professor where userName=?', [curUser], function (err, result1) {
            if (err) throw err;
            var curProfNum = result1[0].profNum;
            var query = 'select profStu.stuName,profStu.topicName,Paper.* from ' +
                '(select Student.stuName, Student.stuNum,Topic.topicName from Topic,Student ' +
                'where Topic.topicId=Student.topicId and Topic.profNum=?) profStu, Paper ' +
                'where profStu.stuNum=Paper.stuNum';
            db.query(query, [curProfNum], function (err, result2) {
                if (err) throw err;
                res.render('profPaper', { data: result2, moment: moment });
            });
        });
    }
}

exports.profViewPaper = function (req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else {
        var curPaperId = req.params.paperId;
        db.query('select * from Paper where Paper.paperId=?', [curPaperId], function (err, result1) {
            if (err) throw err;
            var curStuNum = result1[0].stuNum;
            var query = 'select Topic.topicName,Student.stuName from Student,Topic ' +
                'where Student.topicId=Topic.topicId and Student.stuNum=?';
            db.query(query, [curStuNum], function (err, result2) {
                if (err) throw err;
                res.render('profViewPaper', {
                    topicName: result2[0].topicName,
                    stuName: result2[0].stuName,
                    paper: result1
                });
            });
        });
    }
}

exports.profGradePaper = function (req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else {
        var curPaperId = req.params.paperId;
        var paperGrade = req.body.paperGrade;
        db.query('update Paper set grades=? where paperId=?',
            [paperGrade, curPaperId], function (err, result) {
                if (err) throw err;
                res.redirect(curPaperId);   
        });
    }
}



//profDefense
exports.profDefense = function(req, res) {
    if(!req.session.islogin) {
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1) {
        res.status(403).send('Forbidden');
    }
    else {
        db.query('call getDefList(?);', [req.session.user.userName], function (err, result) {
            if (err) 
                throw err;
            if(result)
                res.render('profDefenseList', {prof: result[0], defense: result[1], moment: moment});
        });
    }
}

exports.profPostDefense = function(req, res) {
    if(!req.session.islogin) {
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1) {
        res.status(403).send('Forbidden');
    }
    else {
        db.query('call checkDefProf(?,?);',
        [req.body.topicId, req.session.user.userName], function(err, result) {
            console.log(result[0]);
            if(result[0][0].chk)
            {
                let defQuery = 'insert into defense(defDate,defAddress,topicId) value(?,?,?)';
                let defGroupQuery = 'insert into defgradegroup(defId,profNum) value(LAST_INSERT_ID(),?)';
                let success = true;

                db.beginTransaction(function(err) {

                    let funcAry = [];
        
                    let func = function (callback) {
                        db.query(defQuery, [req.body.defDate, req.body.defAddress, req.body.topicId],function(err, results) {
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
                    }
                    funcAry.push(func);

                    for(let i = 0; req.body['prof'+i] !== undefined; i++) 
                    {
                        let func = function (callback){
                                db.query(defGroupQuery, [req.body['prof'+i]],function(err, results) {
                                if(!results || err)
                                {
                                    db.rollback();
                                    success = false;
                                }
                                else if(results.affectedRows === 0)
                                {
                                    console.log(results);
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
                    async.series(funcAry, function (err, result) {
                        if (err)
                        {
                            db.rollback();
                        }
                        else if (success)
                        {
                            db.commit();
                        }
                        res.redirect('/prof/defense');
                    });
                });
            }
        })
    }
}

exports.profGradeDefense = function(req, res) {
    if(!req.session.islogin) {
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1) {
        res.status(403).send('Forbidden');
    }
    else {
        let profQuery = 'select profNum from professor where userName = ?'
        let gradeQuery = 'update defgradegroup set grades = ? where defId = ? and profNum = ?';
        db.query(profQuery, [req.session.user.userName], function (err, result) {
            if(result)
            {
                console.log(req.params.id);
                db.query(gradeQuery, [req.body.grades, req.params.id, result[0].profNum],function (err,r){
                    console.log(r);
                });
            }
        });
        res.redirect('/prof/defense');
    }
}