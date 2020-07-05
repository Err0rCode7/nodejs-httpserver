const express = require('express');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');


const router = express.Router();
const pool = mysql.createPool(config.db());

router.post('/', async (req, res) => {

    console.log("request Ip ( Follow ) :",req.connection.remoteAddress.replace('::ffff:', ''));

    const {user_id, dest_id} = req.body;

    const followedQuery = `update user set follower = follower + 1 where user_id = "${dest_id}";`;
    const followingQuery = `update user set follow = follow + 1 where user_id = "${user_id}";`;
    const followCreateQuery = `insert into follow (user_id, dest_id) values('${user_id}', '${dest_id}');`;
    
    const conn = await pool.getConnection();

    try {

        if (user_id == undefined || dest_id == undefined) {
            throw "Follow Exception : Undefined Request Body";
        }

        if (user_id == dest_id) {
            throw "Follow Exception : user_id is equal to dest_id";
        }

        await conn.beginTransaction();

        const resultFollowed = await conn.query(followedQuery);
        const resultFollowing = await conn.query(followingQuery);
        const resultFollowCreate = await conn.query(followCreateQuery);

        const rowFollowed = resultFollowed[0];
        const rowFollowing = resultFollowing[0];
        const rowFollowCreate = resultFollowCreate[0];

        if (rowFollowed.affectedRows == 0){
            throw "Follow Exception : Cant Find Dest_User";
        }

        if (rowFollowing.affectedRows == 0){
            throw "Follow Exception : Cant Find Src_User";
        }

        if (rowFollowCreate.affectedRows == 0){
            throw "Follow Exception : Cant Create Follow Row";
        }
        
        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {
        console.log(e)
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end();

    } finally {

        conn.release();

    }

});

router.post('/canceling', async (req, res) => {

    console.log("request Ip ( Follow canceling) :",req.connection.remoteAddress.replace('::ffff:', ''));

    const {user_id, dest_id} = req.body;

    const followedQuery = `update user set follower = follower - 1 where user_id = "${dest_id}";`;
    const followingQuery = `update user set follow = follow - 1 where user_id = "${user_id}";`;
    const followDeleteQuery = `delete from follow where user_id = '${user_id}' and dest_id = '${dest_id}';`;

    const conn = await pool.getConnection();

    try {

        if (user_id == undefined || dest_id == undefined) {
            throw "Follow Exception : Undefined Request Body";
        }

        if (user_id == dest_id) {
            throw "Follow Exception : user_id is equal to dest_id";
        }

        await conn.beginTransaction();

        const resultFollowed = await conn.query(followedQuery);
        const resultFollowing = await conn.query(followingQuery);
        const resultFollowDelete = await conn.query(followDeleteQuery);
        
        const rowFollowed = resultFollowed[0];
        const rowFollowing = resultFollowing[0];
        const rowFollowDelete = resultFollowDelete[0];

        if (rowFollowed.affectedRows == 0){
            throw "Follow Exception : Cant Find Dest_User";
        }
        if (rowFollowing.affectedRows == 0){
            throw "Follow Exception : Cant Find Src_User";
        }
        if (rowFollowDelete.affectedRows == 0){
            throw "Follow Exception : Cant Create Follow Row";
        }

        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {
        console.log(e)
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end();

    } finally {

        conn.release();

    }

});

module.exports = router;