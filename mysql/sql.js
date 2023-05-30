let mysql = require("mysql");

exports.c = mysql.createConnection({
    host    : '127.0.0.1',
    user    : 'root',
    password: '123456',
    database: 'gpms'
});