const express = require('express');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');

const router = express.Router();

const pool = mysql.createPool(config.db());

router.get('/', async (req, res) => {


    console.log("request Ip :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');
    
    const conn = await pool.getConnection();
    const query = `select user_id, \
                        nick_name, \
                        first_name, \
                        last_name, \
                        date_created, \
                        date_updated \
                    from user;`;
    try {
        const result = await conn.query(query);
        let rows = result[0];

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

router.get('/:id', async (req, res) => {


    console.log("request Ip :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const query = `select user_id, \
                        nick_name, \
                        first_name, \
                        last_name, \
                        date_created, \
                        date_updated \
                    from user \
                    where user_id = "${req.params.id}";`;

    const conn = await pool.getConnection();
    try {
        const result = await conn.query(query);
        let rows = result[0];

        if (rows.length == 0){
            throw "Exception : Cant Find User";
        }

        //rows.unshift({"success":true});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rows)); //json object로 변경

    } catch (e) {
        console.log(e);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end();
        //res.end('{"success": false}'); 
    } finally {
        conn.release();
    }
    
});
//register
router.post('/', async (req, res) => {
    

    console.log("request Ip :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    //console.log(req.body);
    const {user_id, password, nick_name, first_name, last_name} = req.body;
    const query = `insert into user (user_id, \
                                    password, \
                                    nick_name, \
                                    first_name, \
                                    last_name) \
                                values( \
                                    "${user_id}", \
                                    password("${password}"), \
                                    "${nick_name}", \
                                    "${first_name}", \
                                    "${last_name}");`;
    const conn = await pool.getConnection();
    try {

        await conn.beginTransaction();

        /*
            특수문자 예외 처리 필요한 부분
        */

        const result = await conn.query(query)
        const rows = result[0];
        
        if (rows.affectedRows == 0)
            throw "Exception : Cant Insert User";

        await conn.commit();
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}'); 
        
    } catch (e) {
        await conn.rollback();
        console.log(e);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}'); 
    } finally {
        conn.release();
    }

    
});

router.post('/auth', async (req, res) =>{


    console.log("request Ip :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const query = `select user_id from user where user_id = "${req.body.user_id}" and password = password("${req.body.password}");`;   
    const conn = await pool.getConnection();
    try {
        const result = await conn.query(query);
        const rows = result[0];
        if (rows.length == 0)
            throw "Exception : Incorrect Id, Password";

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}'); 

    } catch(e) {
        console.log(e);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}'); 

    } finally {
        conn.release();
    }

});

router.put('/', async (req, res) => {


    console.log("request Ip :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const {password, nick_name, first_name, last_name, user_id} = req.body;
    const query = `update user set \
    password = password("${password}"), \
    nick_name = "${nick_name}", \
    first_name = "${first_name}", \
    last_name = "${last_name}", \
    date_updated = now() \
    where user_id = "${user_id}";`;

    const conn = await pool.getConnection();
    try {
        
        await conn.beginTransaction();

        const result = await conn.query(query);
        const rows = result[0];
        if (rows.affectedRows == 0)
            throw "Exception : Cant Update User";

        await conn.commit();
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}'); 
        
    } catch (e) {
        await conn.rollback();
        console.log(e);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}'); 
    } finally {
        conn.release();
    }

});

router.delete('/:id', async (req, res) =>{


    console.log("request Ip :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const query = `delete from user \
                    where user_id="${req.params.id}"`;
    const conn = await pool.getConnection();
    try {

        await conn.beginTransaction();

        const result = await conn.query(query);
        const rows = result[0];
        if (rows.affectedRows == 0 )
            throw "Exception : Cant Delete User";
        
        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}'); 

    } catch (e) {
        console.log(e);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}'); 
    } finally {
        conn.release();
    }
});

module.exports = router;
