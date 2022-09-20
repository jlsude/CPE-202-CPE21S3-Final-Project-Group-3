var express = require('express');

var router = express.Router();

var dbConn = require('../../config/db.js');

//---------------------- Client Access -------------------------------------

// INSERT
// @routes POST appointment_table/add
// @desc INSERT data / make appointments
// @access PUBLIC / Client access
router.post('/c/add',(req,res) =>{
    // get the input from the user trough request (req)
    console.log(req.body);
    var clientid = req.body.clientid;
    var appointmentdate = req.body.appointmentdate;
    var appointmentservice = req.body.appointmentservice;
    var appointmentnumberproducts = req.body.appointmentnumberproducts;
    var appointmentvenue = req.body.appointmentvenue;

    // connect to mysql database and perform INSERT Query
    sqlQuery = `INSERT INTO appointment_table(client_id, appointment_date, appointment_service, appointment_number_products, appointment_venue, appointment_status) VALUES ("${clientid}", "${appointmentdate}", "${appointmentservice}", "${appointmentnumberproducts}", "${appointmentvenue}", "PENDING")`

    dbConn.query(sqlQuery, function( error, results, fields ){
        if (error) throw error;
        res.status(200).json(results);
    });

});

// UPDATE
// @routes UPDATE appointment_table/update/:id
// @desc UPDATE Data except the appointment_status
// access PUBLIC / Client access
router.put('/c/update/:appointmentid', (req, res) => {

    console.log(req.body);
    var clientid = req.body.clientid;
    var appointmentdate = req.body.appointmentdate;
    var appointmentservice = req.body.appointmentservice;
    var appointmentnumberproducts = req.body.appointmentnumberproducts;
    var appointmentid = req.params.appointmentid;

    sqlQuery = `UPDATE appointment_table SET client_id = "${clientid}", appointment_date = "${appointmentdate}", appointment_service = "${appointmentservice}", appointment_number_products = "${appointmentnumberproducts}", appointment_status = "PENDING" WHERE appointment_id=${appointmentid}`;
    
    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

});

// SEARCH record by client ID
// @routes GET client_table/search/:id
// @desc Search his own appointments
// @access PUBLIC / Client access
router.get('/c/search_client_id/:clientid', (req, res) => {

    console.log(req.params);
    var clientid = req.params.clientid;

    sqlQuery = `SELECT * FROM appointment_table WHERE client_id=${clientid}`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

})

/*
// SEARCH record by client name
// @routes GET temperature/searchname/:device_id
// @desc Search specific Data using like function
// @access PUBLIC
router.get('/c/search_client_name/:clientname', (req, res) => {

    console.log(req.params);
    var clientname = req.params.clientname;

    sqlQuery = `SELECT * FROM client_table WHERE client_name LIKE "%${clientname}%"`;

    dbConn.query(sqlQuery, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json(results);
        });

})
*/

//---------------------- Manager Access -------------------------------------
// DELETE
// @routes DELETE client_table/m/delete/:id
// @desc DELETE Data
// @access PRIVATE
router.delete('/m/delete/:appointmentid', (req, res) => {

    var appointmentid = req.params.appointmentid;

    sqlQuery = `DELETE FROM appointment_table WHERE appointment_id=${appointmentid}`;
    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({
      msg: 'Data Successfully Deleted',
      results: results,
    });
    });
  
});

// VIEW
// @routes GET appointment_table/m/view
// @desc View 
// @access PRIVATE / Manager access
router.get('/m/view', (req, res) => {
    sqlQuery = `SELECT * FROM appointment_table`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});

// UPDATE for Eval
// @routes UPDATE appointment_table/update/:id
// @desc UPDATE appointment_status only
// access PRIVATE / Manager access
router.put('/m/update/:appointmentid', (req, res) => {

    console.log(req.body);
    var appointmentstatus = req.body.appointmentstatus;
    var appointmentid = req.params.appointmentid;

    sqlQuery1 = `UPDATE appointment_table SET appointment_status = "${appointmentstatus}" WHERE appointment_id=${appointmentid}`;

    dbConn.query(sqlQuery1, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

});

module.exports = router;