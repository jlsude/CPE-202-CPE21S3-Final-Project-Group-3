var express = require('express');

var router = express.Router();

var dbConn = require('../../config/db.js');

//---------------------- Manager Access -------------------------------------

// INSERT
// @routes POST /acked_appointment_table/add
// @desc INSERT data / make appointments
// @access PRIVATE / Manager access
router.post('/m/add',(req,res) =>{
    // get the input from the user trough request (req)
    console.log(req.body);
    var appointmentid = req.body.appointmentid;
    var paymentid = req.body.paymentid;

    // connect to mysql database and perform INSERT Query
    sqlQuery = `INSERT INTO acknowledged_appointment_table(appointment_id, payment_id) VALUES ("${appointmentid}", "${paymentid}")`

    dbConn.query(sqlQuery, function( error, results, fields ){
        if (error) throw error;
        res.status(200).json(results);
    });
});

// VIEW
// @routes GET acked_appointment_table/m/view
// @desc View 
// @access PRIVATE / Manager access
router.get('/m/view', (req, res) => {
    sqlQuery = `SELECT * FROM acknowledged_appointment_table`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});

// UPDATE
// @routes UPDATE acked_appointment_table/update/:id
// @desc UPDATE
// access PRIVATE / Manager access
router.put('/m/update/:ackappid', (req, res) => {

    console.log(req.body);
    var ackappid = req.params.ackappid;
    var appointmentid = req.body.appointmentid;
    var paymentid = req.body.paymentid;

    sqlQuery1 = `UPDATE acknowledged_appointment_table SET appointment_id = "${appointmentid}", payment_id = "${paymentid}" WHERE ackapp_id=${ackappid}`;

    dbConn.query(sqlQuery1, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

});

// DELETE
// @routes DELETE acked_appointment_table/m/delete/:id
// @desc DELETE Data
// @access PRIVATE
router.delete('/m/delete/:ackappid', (req, res) => {

    var ackappid = req.params.ackappid;

    sqlQuery = `DELETE FROM acknowledged_appointment_table WHERE ackapp_id=${ackappid}`;
    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({
      msg: 'Data Successfully Deleted',
      results: results,
    });
    });
  
});











module.exports = router;