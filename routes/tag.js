const express = require('express');
const config = require('../config/config')
const mysql = require('mysql2/promise');

const ip = { // 서버 공인아이피
    address () { return config.url().newIp }
};

const router = express.Router();
const pool = mysql.createPool(config.db());

router.get('/', async (req, res) => {


    console.log("request Ip ( Get Tags ):",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    /*
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }
    */

    let conn;

    const query = `select user_id, \
                        nick_name, \
                        first_name, \
                        last_name, \
                        email_id, \
                        email_domain, \
                        date_created, \
                        date_updated, \
                        follow, \
                        follower, \
                        image_url, \
                        image_name \
                    from user;`;
    try {

        conn = await pool.getConnection();

        const result = await conn.query(query);
        let rows = result[0];

        if (ip.address() != config.url().ip) {
            rows.forEach(row => {
                row.image_url = row.image_url.replace(config.url().ip, ip.address());
            });
        }

        //rows.unshift({"success":true});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rows)); //json object로 변경

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