const express = require('express');
const mysql = require('mysql');
const config = require('../config/config.js');

const router = express.Router();

const connection = mysql.createConnection(config.db());
connection.connect((err) => {
    if(err) {
        console.log('user router : ' + err);
        return;
    }
});

router.get('/:id', (req, res) => {

    /* sql select userId */
    const query = `select * from user where user_id = "${req.params.id}"`
    connection.query(query, (err, rows) => {
            if (err) {
                console.log('query error : '+ err);
                throw err;
            } else {
                //rows is array type containing json
                console.log(rows[0]);
                res.writeHead(200, {'Content-Type':'application/json'});
                
                //json object로 변경
                res.end(JSON.stringify(rows[0]));
            }
            
    })
    /* sql select userID */
});

module.exports = router;
