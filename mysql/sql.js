var mysql = require("mysql");

var db = mysql.createConnection({
    host    : '127.0.0.1',
    user    : 'root',
    password: '123456',
    database: 'gpms'
});
db.connect();
module.exports = db;