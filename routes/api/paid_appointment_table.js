var express = require('express');

var router = express.Router();

var dbConn = require('../../config/db.js');

//---------------------- Client Access -------------------------------------
// SEARCH
// @routes GET paid_appointment_table/c/search_client_id/:clientid
// @desc SEARCH payments under client_id
// @access PUBLIC / Client access
router.get('/c/search_client_id/:clientid', (req, res) => {

    console.log(req.params);
    var clientid = req.params.clientid;

    sqlQuery = `SELECT * FROM paid_appointment_table WHERE client_id = "${clientid}"`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});

// INSERT
// @routes POST paid_appointment_table/c/add
// @desc make payments
// @access PUBLIC / Client access
router.post('/c/add',(req,res) =>{
    // get the input from the user trough request (req)
    console.log(req.body);
    var clientid = req.body.clientid;
    var appointmentid = req.body.appointmentid;
    var paymentreferencenumber = req.body.paymentreferencenumber;
    var paymentamount = req.body.paymentamount;
    var paymentdetails = req.body.paymentdetails;
    var paymentdate = req.body.paymentdate;

    // connect to mysql database and perform INSERT Query
    sqlQuery = `INSERT INTO paid_appointment_table(client_id, appointment_id, payment_reference_number, payment_amount, payment_details, payment_date, payment_status) VALUES ("${clientid}", "${appointmentid}", "${paymentreferencenumber}", "${paymentamount}", "${paymentdetails}", "${paymentdate}", "FOR VERIFICATION")`

    dbConn.query(sqlQuery, function( error, results, fields ){
        if (error) throw error;
        res.status(200).json(results);
    });

});

//---------------------- Manager Access -------------------------------------
// UPDATE
// @routes UPDATE paid_appointment_table/update/:id
// @desc Evaluate payments made
// access PRIVATE / Manager access
router.put('/m/update/:paymentid', (req, res) => {
    //print body for checking
    console.log('data with a payment id:', req.params.paymentid, 'has been modified with a following data below:')
    console.log(req.body);
    var paymentstatus = req.body.paymentstatus;
    var paymentid = req.params.paymentid;

    sqlQuery = `UPDATE paid_appointment_table SET payment_status = "${paymentstatus}" WHERE payment_id=${paymentid}`;
    
    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

});

// DELETE
// @routes DELETE paid_appointment_table/m/delete/:id
// @desc DELETE Data
// @access PRIVATE / Manager Access
router.delete('/m/delete/:paymentid', (req, res) => {
    //print body for checking
    var paymentid = req.params.paymentid;

    sqlQuery = `DELETE FROM paid_appointment_table WHERE payment_id=${paymentid}`;
    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({
      msg: 'Data Successfully Deleted',
      results: results,
    });
    });
  
});

// VIEW
// @routes GET paid_appointment_table/view
// @desc View all payments made
// @access PRIVATE / Manager Access
router.get('/m/view', (req, res) => {
    sqlQuery = `SELECT * FROM paid_appointment_table`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});


module.exports = router;