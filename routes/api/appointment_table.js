var express = require('express');

var router = express.Router();

const jwt = require('jsonwebtoken');

var dbConn = require('../../config/db.js');




//---------------------- Client Access -------------------------------------

// Client Make Appoinment
// @routes POST /c/client_make_appointment
// @desc Client get to make appoinments
// @access PUBLIC / Client level access
router.post('/c/client_make_appointment',(req,res) =>{

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(decodedToken.data['client_id']);
    console.log(decodedToken.data['client_email']);

    console.log(req.body);
    var clientid = decodedToken.data['client_id'];
    var appointmentdate = req.body.appointmentdate;
    var appointmentservice = req.body.appointmentservice;
    var appointmentnumberproducts = req.body.appointmentnumberproducts;
    var appointmentvenue = req.body.appointmentvenue;



    sqlQuery = `INSERT INTO appointment_table(client_id, appointment_date, appointment_service, 
        appointment_number_products, appointment_venue, appointment_status) 
    VALUES ("${clientid}", "${appointmentdate}", "${appointmentservice}", 
    "${appointmentnumberproducts}", "${appointmentvenue}", "PENDING")`

    dbConn.query(sqlQuery, function( error, results, fields ){
        if (error) throw error;
        res.status(200).json(results);
    });

});

// Client Update Appointment
// @routes UPDATE /c/client_update_appointment/:appointmentid
// @desc Client get to update their appointment
// access PUBLIC / Client level access
router.put('/c/client_update_appointment/:appointmentid', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(decodedToken.data['client_id']);
    console.log(decodedToken.data['client_email']);

    console.log(req.body);
    var appointmentdate = req.body.appointmentdate;
    var appointmentservice = req.body.appointmentservice;
    var appointmentnumberproducts = req.body.appointmentnumberproducts;
    var appointmentvenue = req.body.appointmentvenue;
    var appointmentid = req.params.appointmentid;

    sqlQuery = `UPDATE appointment_table SET appointment_date = "${appointmentdate}", 
    appointment_service = "${appointmentservice}", appointment_number_products = "${appointmentnumberproducts}", appointment_venue = "${appointmentvenue}", 
    appointment_status = "PENDING" WHERE appointment_id=${appointmentid}`;
    
    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

});

// Client View All Their Appointments
// @routes GET client_table/search/:id
// @desc Client get to view all their appointments
// @access PUBLIC / Client level access
router.get('/c/client_all_appointments', (req, res) => {

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);

    console.log(decodedToken.data['client_id']);
    console.log(decodedToken.data['client_email']);

    console.log(req.params);

    sqlQuery = `SELECT * FROM appointment_table WHERE client_id=${decodedToken.data['client_id']}`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

})

//---------------------- Manager Access -------------------------------------

// VIEW
// @routes GET /m/view_all_appointments
// @desc Manager get to view appointments
// @access PRIVATE / Manager level access
router.get('/m/view_all_appointments', (req, res) => {

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

        sqlQuery = `SELECT * FROM appointment_table`
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

// UPDATE for Eval
// @routes UPDATE /m/eval_appointments/:appointmentid
// @desc UPDATE appointment_status only
// access PRIVATE / Manager level access
router.put('/m/eval_appointments/:appointmentid', (req, res) => {

    console.log(req.body);
    var appointmentstatus = req.body.appointmentstatus;
    var appointmentid = req.params.appointmentid;

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);
   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        sqlQuery = `UPDATE appointment_table SET appointment_status = "${appointmentstatus}" 
        WHERE appointment_id=${appointmentid}`;

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

// DELETE
// @routes DELETE /m/delete_appointments/:appointmentid
// @desc Manager get to delete data
// @access PRIVATE / Manager level access
router.delete('/m/delete_appointments/:appointmentid', (req, res) => {

    var appointmentid = req.params.appointmentid;

    const token = req.headers.authorization.split(' ')[1];
    if (!token){
        res.status(200).json({success: false, msg: 'Error, Token was not found'});
    }
    const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN);
   
    if (decodedToken.data['client_id'] == 10000){
        console.log(decodedToken.data['client_email']);
        console.log(decodedToken.data['client_id']);
        console.log("access granted");

        sqlQuery = `DELETE FROM appointment_table WHERE appointment_id=${appointmentid}`;
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