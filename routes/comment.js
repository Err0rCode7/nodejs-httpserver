const express = require('express');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');


const router = express.Router();
const pool = mysql.createPool(config.db());

router.post('/', async (req, res) => {

    console.log("request Ip ( Post Comment ) :",req.connection.remoteAddress.replace('::ffff:', ''));

    const {user_id, capsule_id, reply_flag} = req.body;

    const createCommentQuery = `insert into comment (user_id, capsule_id, comment, reply_flag, date_created ) \
                                values('${user_id}', ${capsule_id}, '${comment}', ${reply_flag}, now());`;
    
    const conn = await pool.getConnection();

    try {

        if (user_id == undefined || capsule_id == undefined || comment == undefined || reply_flag == undefined) {
            throw "Comment Exception : Undefined Request Body";
        }

        if (comment.length >= 400) {
            throw "Commnet Exception : Comment's length is too long ";
        }

        await conn.beginTransaction();

        const resultCreateComment = await conn.query(createCommentQuery);

        const rowCreateComment = resultCreateComment[0];

        if (rowCreateComment.affectedRows == 0){
            throw "Follow Exception : Cant Create Comment";
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

router.post('/deleting', async (req, res) => {

    console.log("request Ip ( Post Deleting Comment ) :",req.connection.remoteAddress.replace('::ffff:', ''));

    const {user_id, comment_id} = req.body;
    const deleteCommnetQuery = `delete comment where user_id = '${user_id}' and comment_id = ${comment_id};`;

    const conn = await pool.getConnection();

    try {

        if (user_id == undefined || capsule_id == undefined || comment == undefined || reply_flag == undefined) {
            throw "Comment Exception : Undefined Request Body";
        }
        
        await conn.beginTransaction();

        const resultDeleteComment = await conn.query(deleteCommnetQuery);
        const rowDeleteComment = resultDeleteComment[0];

        if (rowDeleteComment.affectedRows == 0){
            throw "Follow Exception : Cant Delete Comment";
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