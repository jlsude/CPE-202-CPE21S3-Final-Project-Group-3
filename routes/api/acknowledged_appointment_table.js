var express = require('express');

var router = express.Router();

const jwt = require('jsonwebtoken');

var dbConn = require('../../config/db.js');

//---------------------- Manager Access -------------------------------------

// Manager POST Acknowledged Appointments
// @routes POST /m/add_acked_appointment_table
// @desc Manager get to post acknowledged appointments
// @access PRIVATE / Manager level access
router.post('/m/add_acked_appointment_table',(req,res) =>{

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    var appointmentid = req.body.appointmentid;
    var paymentid = req.body.paymentid;
   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        sqlQuery = `INSERT INTO acknowledged_appointment_table(appointment_id, payment_id) 
        VALUES ("${appointmentid}", "${paymentid}")`
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

// Manager View All Acknowledged Appointments
// @routes GET /m/view_all_acknowledged_appointments
// @desc Manager get to view all acknowledged appointments
// @access PRIVATE / Manager level access
router.get('/m/view_all_acknowledged_appointments', (req, res) => {

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

        sqlQuery = `SELECT * FROM acknowledged_appointment_table`
        
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

// Manager Update Acknowledged Appointment
// @routes UPDATE /m/update_acknowledged_appointment/:ackappid
// @desc Manager get to update acknowledged appointments
// access PRIVATE / Manager level access
router.put('/m/update_acknowledged_appointment/:ackappid', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);
   
    console.log(req.body);
    var ackappid = req.params.ackappid;
    var appointmentid = req.body.appointmentid;
    var paymentid = req.body.paymentid;


    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        sqlQuery = `UPDATE acknowledged_appointment_table SET appointment_id = "${appointmentid}", 
        payment_id = "${paymentid}" WHERE ackapp_id=${ackappid}`;

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

// Manager Delete Acknowledged Appointments
// @routes /m/delete_acknowledged_appointments/:ackappid
// @desc Manager get to delete acknowledged appointments
// @access PRIVATE / Manager level access
router.delete('/m/delete_acknowledged_appointments/:ackappid', (req, res) => {
    
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

        sqlQuery = `DELETE FROM acknowledged_appointment_table WHERE ackapp_id=${ackappid}`;
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