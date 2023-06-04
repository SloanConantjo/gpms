const connection = require("../mysql/sql");
const db = require("../mysql/sql");
var fs = require('fs');
exports.adminAccount = function(req, res) {
    db.query('SELECT * FROM `account` LIMIT 100', function(err, results){
        res.render('adminAccount', {title: 'Account List', error: err, data: results});
    });
}
exports.adminTopic = function(req, res) {
    db.query('SELECT * FROM `Topic` LIMIT 100', function(err, results){
        res.render('adminTopic', {title: 'Topic List', error: err, data: results});
    });
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
    const username = req.body.username;
    const password = req.body.password;
    const type = req.body.type;
    db.query('select * from account where userName = ? ', [username], function(err, results){
        if (err) {
            throw err;
        } else if (results.length > 0) {
            res.status(400).send('Username already exists');
        } else {
            var Today = new Date();
            var DateToString = Today.toLocaleString();
            db.query('INSERT INTO account VALUES (?, ?, ?, ?)',[username, password, DateToString, type], function(err, results){
                if (err) {
                    throw err;
                } else {
                    res.status(200).send('User created');
                }
            });
        }
    });
}
exports.adminDeleteAccount = function(req, res) {
    const username = req.params.username;
    // console.log(username);
    db.query('DELETE FROM account WHERE userName = ? ', [username], function(err) {
        if (err) {
            throw err;
        } else {
            res.status(200).send('User deleted');
        }
    });
}
exports.adminAccountLike = function(req, res) {
    const type = req.body.type;
    const like = req.body.like;
    if (type == 3) {
        db.query(`SELECT * FROM account WHERE userName LIKE '%${like}%'`, function(err, results) {
            if (err) {
                throw err;
            } else {
                res.render('adminAccount', {title: 'Account List', error: err, data: results});
            }
        });
    }
    else if (type == 1 | type == 2 | type == 0) {
        db.query(`SELECT * FROM (SELECT * FROM account WHERE accLevel = ?) AS temp WHERE temp.userName LIKE '%${like}%'`, [type], function (err, results) {
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
exports.adminAccountEdit = function(req, res) {
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










exports.adminTopicLike = function(req, res) {
    const like = req.body.like;
    db.query(`SELECT * FROM topic WHERE topicName LIKE '%${like}%' UNION SELECT * FROM topic WHERE profile LIKE '%${like}%'`, function (err, results) {
        if (err) {
            throw err;
        } else {
            res.render('adminTopic', {title: 'Topic List', error: err, data: results});
        }
    });

}





