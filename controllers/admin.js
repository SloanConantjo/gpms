const connection = require("../mysql/sql");
const db = require("../mysql/sql");
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
        res.render('adminHome', {title: 'adminHome'});
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
    db.query('DELETE FROM account WHERE userName = ? ', [username], function(err, results) {
        if (err) {
            throw err;
        } else {
            res.status(200).send('User deleted');
        }
    });
}

