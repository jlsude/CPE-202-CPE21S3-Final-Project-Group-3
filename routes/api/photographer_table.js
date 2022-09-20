var express = require('express');

var router = express.Router();

var dbConn = require('../../config/db.js');



//---------------------- Manager Access -------------------------------------

// VIEW
// @routes GET photographer_table/view
// @desc View
// @access PRIVATE / Manager Access
router.get('/m/view', (req, res) => {
    sqlQuery = `SELECT * FROM photographer_table`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});

// INSERT
// @routes POST photographer_table/m/add
// @desc INSERT Data
// @access PRIVATE / Manager Access
router.post('/m/add',(req,res) =>{
    // get the input from the user trough request (req)
    console.log(req.body);
    var photographername = req.body.photographername;
    var photographercontactnumber = req.body.photographercontactnumber;

    // connect to mysql database and perform INSERT Query
    sqlQuery = `INSERT INTO photographer_table(photographer_name, photographer_contact_number) VALUES ("${photographername}", "${photographercontactnumber}")`

    dbConn.query(sqlQuery, function( error, results, fields ){
        if (error) throw error;
        res.status(200).json(results);
    });

});

// UPDATE
// @routes UPDATE photographer_table/mp/update/:id
// @desc UPDATE
// access PRIVATE / Manager and Photogpraher access
router.put('/mp/update/:photographerid', (req, res) => {

    console.log(req.body);
    var photographerid = req.params.photographerid;
    var photographername = req.body.photographername;
    var photographercontactnumber = req.body.photographercontactnumber;

    sqlQuery1 = `UPDATE photographer_table SET photographer_name = "${photographername}", photographer_contact_number = "${photographercontactnumber}" WHERE photographer_id = "${photographerid}"`;

    dbConn.query(sqlQuery1, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

});

// DELETE
// @routes DELETE photographer_table/m/delete/:photographerid
// @desc DELETE Data
// @access PRIVATE / Manager Access
router.delete('/m/delete/:photographerid', (req, res) => {

    var photographerid = req.params.photographerid;

    sqlQuery = `DELETE FROM photographer_table WHERE photographer_id = ${photographerid}`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({
      msg: 'Data Successfully Deleted',
      results: results,
    });
    });
  
});



module.exports = router;