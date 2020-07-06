const express = require('express');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');


const router = express.Router();
const pool = mysql.createPool(config.db());

router.post('/', async (req, res) => {

    console.log("request Ip ( Post likeCapsule ) :",req.connection.remoteAddress.replace('::ffff:', ''));

    const {capsule_id, user_id} = req.body;

    const likeQuery = `update capsule set likes = likes + 1 where capsule_id = ${capsule_id};`;
    const likeCreateQuery = `insert into likeCapsule (user_id, capsule_id) values('${user_id}', ${capsule_id});`;
    
    const conn = await pool.getConnection();

    try {

        if (user_id == undefined || capsule_id == undefined) {
            throw "Follow Exception : Undefined Request Body";
        }

        await conn.beginTransaction();

        const resultLike = await conn.query(likeQuery);
        const resultLikeCreate = await conn.query(likeCreateQuery);

        const rowLike = resultLike[0];
        const rowLikeCreate = resultLikeCreate[0];

        if (rowLike.affectedRows == 0){
            throw "Follow Exception : Cant Find capsule_id";
        }

        if (rowLikeCreate.affectedRows == 0){
            throw "Follow Exception : Cant Create Like";
        }
        
        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {
        console.log(e)
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();

    } finally {

        conn.release();

    }

});

router.post('/canceling', async (req, res) => {

    console.log("request Ip ( Post likeCapsule canceling ) :",req.connection.remoteAddress.replace('::ffff:', ''));

    const {capsule_id, user_id} = req.body;

    const likeQuery = `update capsule set likes = likes - 1 where capsule_id = ${capsule_id};`;
    const likeDeleteQuery = `delete from likeCapsule where user_id = '${user_id}' and capsule_id = ${capsule_id};`;
    
    const conn = await pool.getConnection();

    try {

        if (user_id == undefined || capsule_id == undefined) {
            throw "Follow Exception : Undefined Request Body";
        }

        await conn.beginTransaction();

        const resultLike = await conn.query(likeQuery);
        const resultLikeDelete = await conn.query(likeDeleteQuery);

        const rowLike = resultLike[0];
        const rowLikeDelete = resultLikeDelete[0];


        if (rowLike.affectedRows == 0){
            throw "Follow Exception : Cant Find Capsule_User";
        }

        if (rowLikeDelete.affectedRows == 0){
            throw "Follow Exception : Cant Delete Like";
        }
        
        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {
        console.log(e)
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();

    } finally {

        conn.release();

    }

});

module.exports = router;