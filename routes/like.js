const express = require('express');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');


const router = express.Router();
const pool = mysql.createPool(config.db());

router.post('/', async (req, res) => {

    console.log("request Ip ( Post likeCapsule ) :",req.connection.remoteAddress.replace('::ffff:', ''));

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    const {capsule_id, nick_name} = req.body;

    const likeQuery = `update capsule set likes = likes + 1 where capsule_id = ${capsule_id};`;
    const likeCreateQuery = `insert into likeCapsule (nick_name, capsule_id) values('${nick_name}', ${capsule_id});`;
    
    let conn;

    try {

        conn = await pool.getConnection();

        if (nick_name == undefined || capsule_id == undefined) {
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
        await conn.rollback();
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();

    } finally {

        conn.release();

    }

});

router.delete('', async (req, res) => {

    console.log("request Ip ( Delete Like ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const {capsule_id, nick_name} = req.query;

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    const likeQuery = `update capsule set likes = likes - 1 where capsule_id = ${capsule_id};`;
    const likeDeleteQuery = `delete from likeCapsule where nick_name = '${nick_name}' and capsule_id = ${capsule_id};`;
    
    let conn;

    try {

        conn = await pool.getConnection();

        if (nick_name == undefined || capsule_id == undefined) {
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
        await conn.rollback();
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();

    } finally {

        conn.release();

    }

});

module.exports = router;