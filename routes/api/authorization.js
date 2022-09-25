var express = require('express');

var router = express.Router();

const jwt = require('jsonwebtoken');

var dbConn = require('../../config/db.js');


//Manager Login
//@ routes POST /manager_login
router.post('/manager_login', (req, res, next) => {

    var clientemail = req.body.manageremail;
    var clientpassword = req.body.managerpassword;
    try {
        sqlQuery = `SELECT * FROM client_table WHERE client_email = "${clientemail}" 
        AND client_password = "${clientpassword}"`;
        dbConn.query (sqlQuery, function(error, results){
            
            console.log(results),
            Object.keys(results).forEach(function(key){
                var row = results[key]

                var client_id = row.client_id;
                var client_email = row.client_email;
                var client_name = row.client_name;
                

                var data = {
                    client_id: row.client_id,
                    manager_email: row.client_email,
                    manager_name: row.client_name,
                    
                }

                //Token Creation

                token = jwt.sign(
                    {data: data},
                    process.env.SECRET_TOKEN,
                    {expiresIn: '1h'}
                )
                res.status(200).json({success:true, data: data.manager_email,
                    token: token});
            }) 
        })
    } catch (error){
        console.log(error);
        return next(error);
    }
})

module.exports = router;
