var express = require('express');

var router = express.Router();

const jwt = require('jsonwebtoken');

var dbConn = require('../../config/db.js');

//---------------------- Photographer Access -------------------------------------

// Photographer Login
// @routes GET /login
router.post('/login', (req, res, next) => {

    var photographeremail = req.body.photographeremail;
    var photographerpassword = req.body.photographerpassword;
    try {
        sqlQuery = `SELECT * FROM photographer_table WHERE photographer_email = "${photographeremail}" 
        AND photographer_password = "${photographerpassword}"`;
        dbConn.query (sqlQuery, function(error, results){
            
            console.log(results),
            Object.keys(results).forEach(function(key){
                var row = results[key]

                var photographer_id = row.photographer_id;
                var photographer_email = row.photographer_email;
                var photographer_name = row.photographer_name;
                

                var data = {
                    photographer_id: row.photographer_id,
                    photographer_email: row.photographer_email,
                    photographer_name: row.photographer_name,
                    
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

// Photographer Update Photographer Data
// @routes PUT /p/update_photographer_update_Data
// @desc Photogpraher get to update their own information
// @access Public / Photorapher level access
router.put('/p/update_photographer_data', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(req.body);
    var photographeremail = req.body.photographeremail;
    var photographerpassword = req.body.photographerpassword;
    var photographername = req.body.photographername;
    var photographercontactnumber = req.body.photographercontactnumber;
    var photographeraddress = req.body.photographeraddress;

    sqlQuery = `UPDATE photographer_table SET photographer_email = "${photographeremail}", 
    photographer_password = "${photographerpassword}", 
    photographer_name = "${photographername}", 
    photographer_contact_number = "${photographercontactnumber}"
    WHERE photographer_id=${decodedToken.data['photographer_id']}`;
    
    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

});


//---------------------- Manager Access -------------------------------------


// Manager View All Photographer Information
// @routes GET /m/view_all_photographer_information
// @desc Manager get to view all photographer information
// @access PRIVATE / Manager level access
router.get('/m/view_all_photographer_information', (req, res) => {

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

        sqlQuery = `SELECT * FROM photographer_table`
        dbConn.query(sqlQuery, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json({Note, results});
        });
    }

    else {
        var Note = "You do not have the required level of authorization to access this.";
        res.status(200).json(Note);
    }
});

// Manager Post Photographer Creation
// @routes POST /m/photographer_creation
// @desc Manager get to post photographer information to the table
// @access PRIVATE / Manager level access
router.post('/m/photographer_creation', (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    var photographeremail = req.body.photographeremail;
    var photographerpassword = req.body.photographerpassword;
    var photographername = req.body.photographername;
    var photographercontactnumber = req.body.cphotographercontactnumber;
   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        try {
            sqlQuery = `INSERT INTO photographer_table(photographer_email, photographer_password, photographer_name, photographer_contact_number) 
            VALUES ("${photographeremail}", "${photographerpassword}", "${photographername}", "${photographercontactnumber}")`
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
    }

    else {
        var Note = "You do not have the required level of authorization to access this.";
        res.status(200).json(Note);
    }

})

// Manager Update Photographer Information
// @routes PUT /m/update_photographer_information/:photographerid
// @desc Manager get to update photographer information
// @access Private / Manager level access
router.put('/m/update_photographer_information/:photographerid', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(req.body);
    var photographerid = req.params.photographerid;
    var photographeremail = req.body.photographeremail;
    var photographerpassword = req.body.photographerpassword;
    var photographername = req.body.photographername;
    var photographercontactnumber = req.body.photographercontactnumber;

    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");


        sqlQuery = `UPDATE photographer_table SET photographer_email = "${photographeremail}", 
        photographer_password = "${photographerpassword}", photographer_name = "${photographername}", 
        photographer_contact_number = "${photographercontactnumber}" WHERE photographer_id = "${photographerid}"`;
    
        dbConn.query(sqlQuery, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json(results);
        });
    }

    else {
        var Note = "You do not have the required level of authorization to access this.";
        res.status(200).json(Note);
    }

});

// Manager Delete Photographer Data
// @routes DELETE /m/delete_photographer_data/:photographerid
// @desc Manager get to delete photographer data
// @access PRIVATE / Manager level access
router.delete('/m/delete_photographer_data/:photographerid', (req, res) => {

    var photographerid = req.params.photographerid;

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);
   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");


        sqlQuery = `DELETE FROM photographer_table WHERE photographer_id=${photographerid}`;
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