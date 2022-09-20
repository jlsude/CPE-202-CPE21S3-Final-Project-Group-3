var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'alas_final_project',
});
connection.connect(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('MySQL Database Connected..!');
    }
});

module.exports = connection