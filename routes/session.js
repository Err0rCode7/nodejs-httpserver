const express = require('express');
const config = require('../config/config')
const mysql = require('mysql2/promise');

const ip = { // 서버 공인아이피
    address () { return config.url().newIp }
};

const router = express.Router();
const pool = mysql.createPool(config.db());

router.get('/', async (req, res) => {


    console.log("request Ip ( Get Session ):",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');
    /*
    if(req.session == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }
    */
    let conn;

    const query = `select expires \
                    from sessions \
                    where session_id = "${req.session.id}";`;
    try {

        conn = await pool.getConnection();

        if(req.session.nick_name == undefined) {
            throw "Exception : nick_name in sessions is undefined";
        }

        const result = await conn.query(query);
        let rows = result[0];

        if(rows.length == 0) {
            throw "Exception : Cant find this session";
        }

        //rows.unshift({"success":true});
        
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(`{"nick_name": "${req.session.nick_name}"}`); //json object로 변경

    } catch(e) {
        console.log(e);
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();
        //res.end('{"success": false}'); 
    } finally {
        conn.release();
    }

});

module.exports = router;