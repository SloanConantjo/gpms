const connection = require("../mysql/sql");
const db = require("../mysql/sql");
const moment = require('moment');
var fs = require('fs');
exports.adminAccount = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 0){
        res.status(403).send('Forbidden');
    }
    else
    {
        var query1 = 'SELECT account.userName AS userName, account.accLevel AS accLevel, administrator.adminNum AS Id, ' +
            'administrator.adminName AS Name FROM account, administrator WHERE account.accLevel = 0 AND account.userName = administrator.userName';
        var query2 = 'SELECT account.userName AS userName, account.accLevel AS accLevel, professor.profNum AS Id, ' +
            'professor.profName AS Name FROM account, professor WHERE account.accLevel = 1 AND account.userName = professor.userName';
        var query3 = 'SELECT account.userName AS userName, account.accLevel AS accLevel, student.stuNum AS Id, ' +
            'student.stuName AS Name FROM account, student WHERE account.accLevel = 2 AND account.userName = student.userName';
        var query = query1 + ' UNION ' + query2 + ' UNION ' + query3;
        db.query(query, function(err, results){
            res.render('adminAccount', {title: 'Account List', error: err, data: results});
        });
    }
}
exports.adminTopic = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 0){
        res.status(403).send('Forbidden');
    }
    else
    {
        db.query('SELECT * FROM `Topic` LIMIT 100', function(err, results){
            res.render('adminTopic', {title: 'Topic List', error: err, data: results});
        });
    }
}

exports.adminHome = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 0){
        res.status(403).send('Forbidden');
    }
    else
    {
        fs.readFile('./public/documents/visits.json', 'utf-8', (err, data) => {
            if (err) throw err;
            else {
                var json = JSON.parse(data);
                var str = JSON.stringify(json.data)
                res.render('adminHome', {title: 'adminHome', result: str});
            }
        })
    }
}
exports.adminAddAccount = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 0){
        res.status(403).send('Forbidden');
    }
    else
    {
        const username = req.body.username;
        const password = req.body.password;
        const type = req.body.type;
        const name = req.body.name;
        const id = req.body.id;
        const college = req.body.college;
        db.query('SELECT * FROM account WHERE userName = ?', [username], function(err, results){
            if (err) {
                throw err;
            } else if (results.length > 0) {
                res.status(400).send('Username already exists');
            } else {
                var Today = new Date();
                var time = moment(Today).format('YYYY-MM-DD');
                db.query('INSERT INTO account VALUES (?, ?, ?, ?)',[username, password, time, type], function(err){
                    if (err) {
                        throw err;
                    } else {
                        if (type == 0) {
                            db.query('SELECT * FROM administrator WHERE adminNum = ?', [id], function(err, results1) {
                                if (err) {
                                    throw err;
                                } else if (results1.length > 0) {
                                    res.status(400).send('id already exists');
                                } else {
                                    db.query('INSERT INTO administrator (adminNum, userName, adminName) VALUES (?, ?, ?)',
                                        [id, username, name], function(err){
                                            if (err) {
                                                throw err;
                                            } else {
                                                res.status(200).send('User created');
                                            }
                                        });
                                }
                            });
                        } else if (type == 1) {
                            db.query('SELECT * FROM professor WHERE profNum = ?', [id], function(err, results1) {
                                if (err) {
                                    throw err;
                                } else if (results1.length > 0) {
                                    res.status(400).send('id already exists');
                                } else {
                                    db.query('INSERT INTO professor (profNum, profName, profCollege, userName) VALUES (?, ?, ?, ?)',
                                        [id, name, college, username], function(err){
                                            if (err) {
                                                throw err;
                                            } else {
                                                res.status(200).send('User created');
                                            }
                                        });
                                }
                            });
                        } else {
                            db.query('SELECT * FROM student WHERE stuNum = ?', [id], function(err, results1) {
                                if (err) {
                                    throw err;
                                } else if (results1.length > 0) {
                                    res.status(400).send('id already exists');
                                } else {
                                    db.query('INSERT INTO student (stuNum, stuName, stuMajor, userName) VALUES (?, ?, ?, ?)',
                                        [id, name, college, username], function(err){
                                            if (err) {
                                                throw err;
                                            } else {
                                                res.status(200).send('User created');
                                            }
                                        });
                                }
                            });
                        }
                    }
                });
            }
        });
    }
}
exports.adminDeleteAccount = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 0){
        res.status(403).send('Forbidden');
    }
    else
    {
        const username = req.params.username;
        db.query('DELETE FROM account WHERE userName = ? ', [username], function(err) {
            if (err) {
                throw err;
            } else {
                res.status(200).send('User deleted');
            }
        });
    }
}
exports.adminAccountLike = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 0){
        res.status(403).send('Forbidden');
    }
    else
    {
        const type = req.body.type;
        const like = req.body.like;
        var query0 = `SELECT account.userName AS userName, account.accLevel AS accLevel, administrator.adminNum ` +
        `AS Id, administrator.adminName AS Name FROM account, administrator WHERE account.accLevel = 0 AND ` +
        `account.userName = administrator.userName AND (administrator.adminName LIKE '%${like}%' `+
        `OR administrator.userName LIKE '%${like}%' OR administrator.adminNum LIKE '%${like}%')`;
        var query1 = `SELECT account.userName AS userName, account.accLevel AS accLevel, professor.profNum ` +
            `AS Id, professor.profName AS Name FROM account, professor WHERE account.accLevel = 1 AND `+
            `account.userName = professor.userName AND (professor.profName LIKE '%${like}%' ` +
            `OR professor.userName LIKE '%${like}%' OR professor.profNum LIKE '%${like}%')`;
        var query2 = `SELECT account.userName AS userName, account.accLevel AS accLevel, student.stuNum ` +
            `AS Id, student.stuName AS Name FROM account, student WHERE account.accLevel = 2 AND ` +
            `account.userName = student.userName AND (student.stuName LIKE '%${like}%' ` +
            `OR student.userName LIKE '%${like}%' OR student.stuNum LIKE '%${like}%')`;
        if (type == 3) {
            var query = query0 + ' UNION ' + query1 + ' UNION ' + query2;
            db.query(query, function(err, results) {
                if (err) {
                    throw err;
                } else {
                    res.render('adminAccount', {title: 'Account List', error: err, data: results});
                }
            });
        } else if (type == 0) {
            db.query(query0, function(err, results) {
                if (err) {
                    throw err;
                } else {
                    res.render('adminAccount', {title: 'Account List', error: err, data: results});
                }
            });
        } else if (type == 1) {
            db.query(query1, function(err, results) {
                if (err) {
                    throw err;
                } else {
                    res.render('adminAccount', {title: 'Account List', error: err, data: results});
                }
            });
        } else if (type == 2) {
            db.query(query2, function(err, results) {
                if (err) {
                    throw err;
                } else {
                    res.render('adminAccount', {title: 'Account List', error: err, data: results});
                }
            });
        }
        else {
            throw new Error();
        }
    }
}
exports.adminAccountEdit = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 0){
        res.status(403).send('Forbidden');
    }
    else
    {
        const username = req.body.username;
        const password = req.body.password;
        db.query('UPDATE account SET password = ? WHERE userName = ?', [password, username], function(err, results) {
            if (err) {
                throw err;
            } else {
                res.redirect('/admin/account');
            }
        });
    }
}










exports.adminTopicLike = function(req, res) {
    if(!req.session.islogin){
        res.redirect('/');
    }
    else if(req.session.user.accLevel !== 0){
        res.status(403).send('Forbidden');
    }
    else
    {
        const username = req.body.username;
        const password = req.body.password;
        const like = req.body.like;
        db.query(`SELECT * FROM topic WHERE topicName LIKE '%${like}%' UNION SELECT * FROM topic WHERE profile LIKE '%${like}%'`, function (err, results) {
            if (err) {
                throw err;
            } else {
                res.render('adminTopic', {title: 'Topic List', error: err, data: results});
            }
        });
    }
}





