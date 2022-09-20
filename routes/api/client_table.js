var express = require('express');

var router = express.Router();

var dbConn = require('../../config/db.js');




//---------------------- Client Access -------------------------------------

// INSERT
// @routes POST api/client_table/c/add
// @desc INSERT data to database
// @access Public / Client access
router.post('/c/add',(req,res) =>{
    // get the input from the user trough request (req)
    console.log(req.body);
    var clientname = req.body.clientname;
    var clientcontactnumber = req.body.clientcontactnumber;
    var clientaddress = req.body.clientaddress;

    // connect to mysql database and perform INSERT Query
    sqlQuery = `INSERT INTO client_table(client_name, client_contact_number, client_address) VALUES ("${clientname}", "${clientcontactnumber}", "${clientaddress}")`

    dbConn.query(sqlQuery, function( error, results, fields ){
        if (error) throw error;
        res.status(200).json(results);
    });

});

// UPDATE
// @routes UPDATE client_table/c/update/:clientid
// @desc UPDATE Data
// access Public / Client access
router.put('/c/update/:clientid', (req, res) => {

    console.log(req.body);
    var clientname = req.body.clientname;
    var clientcontactnumber = req.body.clientcontactnumber;
    var clientaddress = req.body.clientaddress;
    var clientid = req.params.clientid;

    sqlQuery = `UPDATE client_table SET client_name = "${clientname}", client_contact_number = "${clientcontactnumber}", client_address = "${clientaddress}" WHERE client_id=${clientid}`;
    
    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

});

// SEARCH record by client ID
// @routes GET client_table/c/search_client_id/:clientid
// @desc Search specific Data with ID
// @access Public / Client access
router.get('/c/search_client_id/:clientid', (req, res) => {

    console.log(req.params);
    var clientid = req.params.clientid;

    sqlQuery = `SELECT * FROM client_table WHERE client_id=${clientid}`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });

})

//---------------------- Manager Access -------------------------------------
// SEARCH record by client name
// @routes GET client_table/m/searchname/:clientname
// @desc Search specific Data using like function
// @access PRIVATE / Manager access
router.get('/m/search_client_name/:clientname', (req, res) => {
    console.log(req.params);
    var clientname = req.params.clientname;

    sqlQuery = `SELECT * FROM client_table WHERE client_name LIKE "%${clientname}%"`;

    dbConn.query(sqlQuery, function (error, results, fields) {
        if (error) throw error;
        res.status(200).json(results);
        });

})

// VIEW
// @routes GET client_table/m/view
// @desc View client information
// @access PRIVATE / Manager access
router.get('/m/view', (req, res) => {
    sqlQuery = `SELECT * FROM client_table`;

    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
    });
});

// DELETE
// @routes DELETE client_table/c/delete/:id
// @desc DELETE Data
// @access PRIVATE / Manager access
router.delete('/m/delete/:clientid', (req, res) => {

    var clientid = req.params.clientid;

    sqlQuery = `DELETE FROM client_table WHERE client_id=${clientid}`;
    dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({
      msg: 'Data Successfully Deleted',
      results: results,
    });
    });
  
});



module.exports = router;