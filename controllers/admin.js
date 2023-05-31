const connection = require("../mysql/sql");

exports.adminAccount = function(req, res) {
    connection.query('SELECT * FROM `account` LIMIT 100', function(err, results){
        res.render('adminAccount', {title: 'Account List', error: err, data: results});
    });
}
exports.adminTopic = function(req, res) {
    connection.query('SELECT * FROM `Topic` LIMIT 100', function(err, results){
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
