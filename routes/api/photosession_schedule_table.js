
var express = require('express');

var router = express.Router();

var dbConn = require('../../config/db.js');

//---------------------- Client Access -------------------------------------


// SEARCH
// @routes GET photosession_schedule_table/c/search/:clientid
// @desc View Data
// @access PUBLIC / Client Access
router.get('/c/search/:clientid', (req, res) => {

    var clientid = req.params.clientid;

    sqlQuery = `SELECT photographer_table.photographer_name, photographer_table.photographer_contact_number, 
    appointment_table.appointment_date,
    appointment_table.appointment_service,
    appointment_table.appointment_venue


    FROM photosession_schedule_table
    INNER JOIN appointment_table
    ON photosession_schedule_table.appointment_id = appointment_table.appointment_id
    INNER JOIN photographer_table
    ON photosession_schedule_table.photographer_id = photographer_table.photographer_id
    WHERE appointment_table.client_id = "${clientid}";`

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});

//---------------------- Photographer Access -------------------------------------

// SEARCH
// @routes GET photosession_schedule_table/p/search/:photographerid
// @desc View Data
// @access PUBLIC / Photographer Access
router.get('/p/search/:photographerid', (req, res) => {

    var photographerid = req.params.photographerid;

    sqlQuery = `SELECT 
    client_table.client_name,
    client_table.client_contact_number,
    client_table.client_address,
    appointment_table.appointment_date,
    appointment_table.appointment_service,
    appointment_table.appointment_venue


    FROM photosession_schedule_table
    INNER JOIN appointment_table
    ON photosession_schedule_table.appointment_id = appointment_table.appointment_id
    INNER JOIN client_table
    ON appointment_table.client_id = client_table.client_id
    WHERE photosession_schedule_table.photographer_id = "${photographerid}";`

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});

//---------------------- Manager Access -------------------------------------
// VIEW
// @routes GET photosession_schedule_table/view
// @desc View Data
// @access PRIVATE / Manager Access
router.get('/m/view', (req, res) => {

    sqlQuery = `SELECT * FROM photosession_schedule_table`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});

// INSERT
// @routes POST photosession_schedule_table/m/add
// @desc INSERT data
// @access PRIVATE / Manager Access
router.post('/m/add',(req,res) =>{
    // get the input from the user trough request (req)
    console.log(req.body);

    var photographerid = req.body.photographerid;
    var appointmentid = req.body.appointmentid;
    var ackappid = req.body.ackappid;

    // connect to mysql database and perform INSERT Query
    sqlQuery = `INSERT INTO photosession_schedule_table(photographer_id, appointment_id, ackapp_id) VALUES ("${photographerid}", "${appointmentid}", "${ackappid}")`

    dbConn.query(sqlQuery, function( error, results, fields ){
        if (error) throw error;
        res.status(200).json(results);
    });

});

// UPDATE
// @routes UPDATE photosession_schedule_table/m/update/:psid
// @desc UPDATE
// access PRIVATE / Manager access
router.put('/m/update/:psid', (req, res) => {

    console.log(req.body);
    var psid = req.params.psid;
    var photographerid = req.body.photographerid;
    var appointmentid = req.body.appointmentid;
    var ackappid = req.body.ackappid;

    sqlQuery1 = `UPDATE photosession_schedule_table SET photographer_id = "${photographerid}", appointment_id = "${appointmentid}", ackapp_id = "${ackappid}" WHERE ps_id = "${psid}"`;

    dbConn.query(sqlQuery1, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

});

// DELETE
// @routes DELETE photosession_schedule_table/m/delete/:photographerid
// @desc DELETE Data
// @access PRIVATE / Manager Access
router.delete('/m/delete/:psid', (req, res) => {

    var psid = req.params.psid;

    sqlQuery = `DELETE FROM photosession_schedule_table WHERE ps_id = ${psid}`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({
      msg: 'Data Successfully Deleted',
      results: results,
    });
    });
  
});







module.exports = router;