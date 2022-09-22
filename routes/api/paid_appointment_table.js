var express = require('express');

var router = express.Router();

const jwt = require('jsonwebtoken');

var dbConn = require('../../config/db.js');

//---------------------- Client Access -------------------------------------

// Client Post Payment
// @routes POST /c/client_post_payment
// @desc Client get to post their payment for their appointment
// @access PUBLIC / Client level access
router.post('/c/client_post_payment',(req,res) =>{

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(decodedToken.data['client_id']);
    console.log(decodedToken.data['client_email']);
    console.log(req.body);

    var clientid = decodedToken.data['client_id'];
    var appointmentid = req.body.appointmentid;
    var paymentreferencenumber = req.body.paymentreferencenumber;
    var paymentamount = req.body.paymentamount;
    var paymentdetails = req.body.paymentdetails;
    var paymentdate = req.body.paymentdate;

    sqlQuery = `INSERT INTO paid_appointment_table(client_id, appointment_id, payment_reference_number, 
        payment_amount, payment_details, payment_date, payment_status) 
    VALUES ("${clientid}", "${appointmentid}", "${paymentreferencenumber}", "${paymentamount}", 
    "${paymentdetails}", "${paymentdate}", "FOR VERIFICATION")`

    dbConn.query(sqlQuery, function( error, results, fields ){
        if (error) throw error;
        res.status(200).json(results);
    });

});

// Client View Their Payments
// @routes GET /c/client_view_payments
// @desc Client get to view their payments
// @access PUBLIC / Client level access
router.get('/c/client_view_payments', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(decodedToken.data['client_id']);
    console.log(decodedToken.data['client_email']);

    console.log(req.params);

    sqlQuery = `SELECT * FROM paid_appointment_table WHERE client_id=${decodedToken.data['client_id']}`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});


//---------------------- Manager Access -------------------------------------

// Manager View All Payments
// @routes GET /m/view_all_payments
// @desc Manager get to view all payments made
// @access PRIVATE / Manager level Access
router.get('/m/view_all_payments', (req, res) => {
    
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

        sqlQuery = `SELECT * FROM paid_appointment_table`
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

// Manager Evaluate Payments
// @routes UPDATE /m/eval_payments/:paymentid
// @desc Manager get to valuate payments made
// access PRIVATE / Manager level access
router.put('/m/eval_payments/:paymentid', (req, res) => {

    console.log(req.body);
    var paymentstatus = req.body.paymentstatus;
    var paymentid = req.params.paymentid;

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);
   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        sqlQuery = `UPDATE paid_appointment_table SET payment_status = "${paymentstatus}" 
        WHERE payment_id=${paymentid}`;

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

// Manager Delete Payments
// @routes DELETE /m/delete_payments/:paymentid
// @desc Manager get to delete payments made
// @access PRIVATE / Manager level access
router.delete('/m/delete_payments/:paymentid', (req, res) => {

    var paymentid = req.params.paymentid;

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);
   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        sqlQuery = `DELETE FROM paid_appointment_table WHERE payment_id=${paymentid}`;
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