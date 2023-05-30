const connection = require("../mysql/sql");

exports.adminAccount = function(req, res) {
    connection.query('SELECT * FROM `account` LIMIT 100', function(err, results, fields){
        res.render('adminAccount', {title: 'Account List', error: err, data: results});
    });
}

exports.adminHome = function(req, res) {
    if(!req.session.islogin){
        return res.send({status: 1, msg: 'fail'});
    }
    res.render('adminHome', {title: 'adminHome'});
}
