var express = require('express');

const jwt = require('jsonwebtoken');

var router = express.Router();

var dbConn = require('../../config/db.js');



//Client Signup
//@ routes POST /client_table/signup
router.post('/signup', (req, res, next) => {
    var clientemail = req.body.clientemail;
    var clientpassword = req.body.clientpassword;
    var clientname = req.body.clientname;
    var clientcontactnumber = req.body.clientcontactnumber;
    var clientaddress = req.body.clientaddress;

    try {
        sqlQuery = `INSERT INTO client_table(client_email, client_password, client_name, client_contact_number, client_address) 
        VALUES ("${clientemail}", "${clientpassword}", "${clientname}", "${clientcontactnumber}", "${clientaddress}")`
        dbConn.query (sqlQuery, function(error, results){
            console.log(results.insertId);
            userId = results.insertId
            res.status(200).json(
                {success:true, userId: userId}
            )
        })
        

    } catch (error){
        console.log(error);
        return next(error);
    }
})

//Client Login
//@ routes POST /client_table/login
router.post('/login', (req, res, next) => {

    var clientemail = req.body.clientemail;
    var clientpassword = req.body.clientpassword;
    try {
        sqlQuery = `SELECT * FROM client_table WHERE client_email = "${clientemail}" AND client_password = "${clientpassword}"`;
        dbConn.query (sqlQuery, function(error, results){
            
            console.log(results),
            Object.keys(results).forEach(function(key){
                var row = results[key]

                var client_id = row.client_id;
                var client_email = row.client_email;
                var client_name = row.client_name;
                

                var data = {
                    client_id: row.client_id,
                    client_email: row.client_email,
                    client_name: row.client_name,
                    
                }

                //Create Token

                token = jwt.sign(
                    {data: data},
                    process.env.SECRET_TOKEN,
                    {expiresIn: '1h'}
                )
                res.status(200).json({success:true, data: data, token: token});
            }) 
        })
    } catch (error){
        console.log(error);
        return next(error);
    }
})



//---------------------- Client Access -------------------------------------


// Client View Information
// @routes GET /c/view_client_information
// @desc Client get to view their own information
// @access Public / Client level access
router.get('/c/view_client_data', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(decodedToken.data['client_id']);
    console.log(decodedToken.data['client_email']);

    sqlQuery = `SELECT * FROM client_table WHERE client_id = "${decodedToken.data['client_id']}"`
    dbConn.query(sqlQuery, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json(results);
        });

})

// Client Update Information
// @routes UPDATE /c/update_client_data
// @desc Client get to update their own information
// access Public / Client level access
router.put('/c/update_client_data', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(req.body);
    var clientemail = req.body.clientemail;
    var clientpassword = req.body.clientpassword;
    var clientname = req.body.clientname;
    var clientcontactnumber = req.body.clientcontactnumber;
    var clientaddress = req.body.clientaddress;

    sqlQuery = `UPDATE client_table SET client_email = "${clientemail}", 
    client_password = "${clientpassword}", 
    client_name = "${clientname}", 
    client_contact_number = "${clientcontactnumber}", 
    client_address = "${clientaddress}" WHERE client_id=${decodedToken.data['client_id']}`;
    
    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

});

//---------------------- Manager Access -------------------------------------

// Manager View All Client Information
// @routes GET /m/view_all_client_information
// @desc Manager view client information
// @access PRIVATE / Manager level access
router.get('/m/view_all_client_information', (req, res) => {
    
    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        var Note = "You are accessing this data as manager.";

        sqlQuery = `SELECT * FROM client_table`
        dbConn.query(sqlQuery, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json({Note, results});
        });
    }

    else {
        console.log(decodedToken.data['client_id'])
        var Note = "You do not have the required level of authorization to access this.";
        res.status(200).json(Note);
    }

});

// Manager Search Client Name
// @routes GET client_table/m/searchname/:clientname
// @desc Search specific Data using like function
// @access PRIVATE / Manager level access
router.get('/m/search_client_name/:clientname', (req, res) => {
    console.log(req.params);
    var clientname = req.params.clientname;

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        var Note = "You are accessing this data as manager.";

        sqlQuery = `SELECT * FROM client_table WHERE client_name LIKE "%${clientname}%"`;
        dbConn.query(sqlQuery, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json({Note, results});
        });
    }

    else {
        var Note = "You do not have the required level of authorization to access this.";
        res.status(200).json(Note);
    }
})

// Manager Delete Client Data
// @routes DELETE /m/delete_client_data/:clientid
// @desc Manager get to delete data
// @access PRIVATE / Manager level access
router.delete('/m/delete_client_data/:clientid', (req, res) => {

    var clientid = req.params.clientid;

    
    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");


        sqlQuery = `DELETE FROM client_table WHERE client_id=${clientid}`;
        dbConn.query(sqlQuery, function (error, results, fields) {
            if (error) throw error;
            res.status(200).json({
              msg: 'Data Successfully Deleted',
              results: results,
            });
            });
    }

    else {
        var Note = "You do not have the required level of authorization to access this.";
        res.status(200).json(Note);
    }
});



module.exports = router;