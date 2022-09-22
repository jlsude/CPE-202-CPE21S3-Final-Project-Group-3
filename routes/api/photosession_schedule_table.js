
var express = require('express');

var router = express.Router();

const jwt = require('jsonwebtoken');

var dbConn = require('../../config/db.js');

//---------------------- Client Access -------------------------------------
// Client View Schedules
// @routes GET /c/view_schedules
// @desc Client get to view their schedules
// @access PUBLIC / Client level access
router.get('/c/view_schedules', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(decodedToken.data['client_id']);
    console.log(decodedToken.data['client_email']);

    sqlQuery = `SELECT photographer_table.photographer_name, 
    photographer_table.photographer_contact_number, 
    appointment_table.appointment_date,
    appointment_table.appointment_service,
    appointment_table.appointment_venue


    FROM photosession_schedule_table
    INNER JOIN appointment_table
    ON photosession_schedule_table.appointment_id = appointment_table.appointment_id
    INNER JOIN photographer_table
    ON photosession_schedule_table.photographer_id = photographer_table.photographer_id
    WHERE appointment_table.client_id = "${decodedToken.data['client_id']}";`

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});

//---------------------- Photographer Access -------------------------------------

// Photographer View Schedules
// @routes GET /p/view_schedules
// @desc Photographer get to view their schedules
// @access PUBLIC / Photographer level access
router.get('/p/view_schedules', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(decodedToken.data['photographer_id']);
    console.log(decodedToken.data['photographer_email']);


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
    WHERE photosession_schedule_table.photographer_id = "${decodedToken.data['photographer_id']}";`

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});

//---------------------- Manager Access -------------------------------------
// Manager View All Schedules
// @routes GET /m/view_all_schedules
// @desc Manager get to view all schedules
// @access PRIVATE / Manager level access
router.get('/m/view_all_schedules', (req, res) => {

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

        sqlQuery = `SELECT 
        photosession_schedule_table.ps_id,
        client_table.client_name,
        client_table.client_contact_number,
        client_table.client_address,
        appointment_table.appointment_date,
        appointment_table.appointment_service,
        appointment_table.appointment_venue,
        photographer_table.photographer_name, 
        photographer_table.photographer_contact_number
    
    
        FROM photosession_schedule_table
        INNER JOIN appointment_table
        ON photosession_schedule_table.appointment_id = appointment_table.appointment_id
        INNER JOIN client_table
        ON appointment_table.client_id = client_table.client_id
        INNER JOIN photographer_table
        ON photosession_schedule_table.photographer_id = photographer_table.photographer_id`;

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

// Manager Post Schedule
// @routes POST /m/add_photosession_schedule_data
// @desc Manager get to post schedule
// @access PRIVATE / Manager level access
router.post('/m/add_photosession_schedule_data',(req,res) =>{

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    var photographerid = req.body.photographerid;
    var appointmentid = req.body.appointmentid;
    var ackappid = req.body.ackappid;
   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        sqlQuery = `INSERT INTO photosession_schedule_table(photographer_id, appointment_id, ackapp_id) 
        VALUES ("${photographerid}", "${appointmentid}", "${ackappid}")`
        dbConn.query(sqlQuery, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json({results});
        });
    }

    else {
        var Note = "You do not have the required level of authorization to access this.";
        res.status(200).json(Note);
    }

});

// Manager Update Schedule
// @routes UPDATE /m/update_schedule/:psid
// @desc Manager get update schedule
// access PRIVATE / Manager level access
router.put('/m/update_schedule/:psid', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    var psid = req.params.psid;
    var photographerid = req.body.photographerid;
    var appointmentid = req.body.appointmentid;
    var ackappid = req.body.ackappid;
   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        sqlQuery = `UPDATE photosession_schedule_table SET photographer_id = "${photographerid}", 
        appointment_id = "${appointmentid}", ackapp_id = "${ackappid}" WHERE ps_id = "${psid}"`;

        dbConn.query(sqlQuery, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json({results});
        });
    }

    else {
        var Note = "You do not have the required level of authorization to access this.";
        res.status(200).json(Note);
    }


});

// Manager Delete Schedule
// @routes DELETE /m/delete_schedule/:psid
// @desc Manager get to delete schedule
// @access PRIVATE / Manager level access
router.delete('/m/delete_schedule/:psid', (req, res) => {

    var psid = req.params.psid;

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }

    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    var ackappid = req.params.ackappid;
   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        sqlQuery = `DELETE FROM photosession_schedule_table WHERE ps_id = ${psid}`;

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