const db = require("../mysql/sql");
const moment = require("moment/moment");

exports.profHome = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 1){
        res.status(403).send('Forbidden');
    }
    else
    {
        res.render('profHome', {title: 'profHome'});
    }
}

exports.profPaper = function(req, res) {
    res.render('profPaper', {title: 'profPaper'});
}

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
        console.log(req.body);
        console.log(req.session.user.userName);
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
    var NewNumber = req.body.phoneNum;
    var Email = req.body.email;
    console.log(NewNumber);
    console.log(Email);
    db.query('UPDATE professor SET phoneNum = ?, email = ? WHERE userName = ?',
        [NewNumber, Email, req.session.user.userName],function(err) {
        if (err) throw err;
        res.redirect('/prof/profile');
    });
}

exports.profProfileEditPassword = function(req, res) {
    var Oldpassword = req.body.oldpassword;
    var Newpassword = req.body.newpassword;
    console.log("yes");
    console.log(Oldpassword);
    console.log(Newpassword);
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

exports.profStudents = function(req, res) {
    res.render('profStudents', {title: 'profStudents'});
}

exports.profTopic = function(req, res) {
    // var username = req.session.user.userName;
    // db.query('SELECT profNum FROM professor WHERE userName = ?', [username], function(err, result) {
    //     if (err) throw err;
    //     var profNum = result[0].profNum;
    //     var query = 'SELECT t.topicId, t.topicName, DATE_FORMAT(t.postDate,'%Y-%m-%d') AS postDate,'+
    //         't.state, GROUP_CONCAT(st.stuNum SEPARATOR '\n') AS members, t.grades'+
    //     'FROM topic t'+
    //     'LEFT JOIN student st ON t.topicId = st.topicId'+
    //     'LEFT JOIN professor pr ON t.profNum = pr.profNum'+
    //     'WHERE pr.userName = ?'+
    //     'GROUP BY t.topicId'
    //     db.query(query, [profNum],
        // db.query('SELECT * FROM topic WHERE profNum = ?', [profNum], function(err, result1) {
        //     if (err) throw err;
        //     var topic_info = [];
        //     result1.forEach((topic)=> {
        //         var info = [];
        //         var members = '';
        //         db.query('SELECT * FROM student WHERE topicId = ?', [topic.topicId], function(err, result2) {
        //             if (err) {
        //                 throw err;
        //             }
        //             result2.forEach((student)=> {
        //                 var str = student.stuNum.toString();
        //                 members = members + str + `\n`;
        //             });
        //             if (members.length > 0) {
        //                 members[members.length-1] = '\0';
        //             }
        //             console.log("haha:"+ members);
        //             var date = new Date(topic.postDate);
        //             var time = moment(date).format('YYYY-MM-DD');
        //             info[0] = topic.topicId;
        //             info[1] = topic.topicName;
        //             info[2] = time;
        //             info[3] = topic.state;
        //             info[4] = members;
        //             info[5] = topic.grades;
        //             topic_info.push(info);
        //         });
        //     });
        //     console.log("topic:" + topic_info.toString());
        //     res.render('profTopic', {data: topic_info});
        // });
    // });
}

exports.profDeleteTopic = function(req, res) {
    const topicId = req.params.topicId;
    // console.log(username);
    db.query('DELETE FROM topic WHERE topicId = ? ', [topicId], function(err) {
        if (err) {
            throw err;
        } else {
            res.status(200).send('topic deleted');
        }
    });
}

exports.profTopicInfo = function(req, res) {
    res.render('profTopicInfo', {title: 'profTopicInfo'});
}

exports.profTopicPost = function(req, res) {
    res.render('profTopicPost', {title: 'profTopicPost'});
}
exports.profTopicPostSuccess = function(req, res) {
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
exports.profDefense = function(req, res) {
    res.render('profDefense', {title: 'profDefense'});
}
