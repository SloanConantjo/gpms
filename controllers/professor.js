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
            res.render('profProfile', {profile: results, moment: moment});
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
