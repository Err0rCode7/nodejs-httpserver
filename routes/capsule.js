const express = require('express');
const fs = require('fs');
const mime = require('mime');
const queryString = require('querystring');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const config = require('../config/config')

const connection = mysql.createConnection(config.db());
connection.connect( (err) => {
    if(err) {
        console.log('capsule router : ' + err);
        return;
    }
});

const router = express.Router();

router.get('/', (req, res) => { 
    const query = "select capsule_id, user_id, title, likes, views, date_created, date_viewed, status_temp,\
    y(location) as lat, x(location) as lng from capsule";
    console.log(req.query);
    try {
        connection.query(query, (err,rows) => {
            console.log(rows);
            if (err) {
                console.log('Capsule Get-all Query Error : '+err);
                throw err;
            } else {
                rows.unshift({"success":true});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(rows));
            }
            
        });
    } catch {
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    }
});

router.get('/location', (req, res) => {
    console.log(req.query);
    const query = `select *, U_ST_DISTANCE_SPHERE(POINT(${req.query.log}, ${req.query.lat}), location) as Dist \
    from capsule where U_ST_DISTANCE_SPHERE(POINT(${req.query.log}, ${req.query.lat}), location) <= 100 order by Dist;`

    try {
        connection.query(query, (err, rows) =>{
            if (err) {
                console.log("Capsule Get-location Query Error : "+err);
                throw error;
            } else if (rows) {
                rows.unshift({"success":true});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(rows));
            } else {
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end('{"success": false}');
            }

        });
    } catch {
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    }
});

router.get('/content/:capsuleId', (req, res) => { 

    const query = `select cap.capsule_id, user_id, title, likes, views, date_created, date_viewed, status_temp,\
     y(location) as lat, x(location) as lng, content_id ,url from capsule as cap JOIN content as ct ON cap.capsule_id = ct.capsule_id AND ct.capsule_id = ${req.params.capsuleId};`
    console.log(query);
    try {
        connection.query(query, (err,rows) => {
            if (err) {
                console.log('Capsule Get one with content Error : '+err);
                throw error;
            } else if (rows) {
                rows.unshift({"success":true});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(rows));
            } else {
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end('{"success": false}');
            }
        })
    } catch {
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    }
});



module.exports = router;