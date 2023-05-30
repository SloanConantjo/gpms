const connection = require("../mysql/sql");

exports.adminAccount = function(req, res) {
    connection.c.query('SELECT * FROM `account` LIMIT 100', function(err, results, fields){
        res.render('adminAccount', {title: 'Account List', error: err, data: results});
    });
}