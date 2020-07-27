const express = require('express');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');

const ip = { // 서버 공인아이피
    address () { return config.url().newIp }
};

const router = express.Router();
const pool = mysql.createPool(config.db());

router.get('/followlist/:nickName', async (req, res) => {

    console.log("request Ip ( Get Follow List ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const nickName = req.params.nickName;

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    const followListQuery = `select \
                                user.nick_name as nick_name, \
                                user.first_name as first_name, \
                                user.last_name as last_name, \
                                user.date_created as date_created, \
                                user.date_updated as date_updated, \
                                user.follow as follow, \
                                user.follower as follower, \
                                user.image_url as image_url, \
                                user.image_name as image_name \
                            from follow as fl \
                            INNER JOIN user \
                            ON fl.dest_nick_name = user.nick_name \
                            where fl.nick_name = '${nickName}' \
                            ORDER BY fl.id;`



    let conn;

    try {

        if (nickName == undefined) {
            throw "Follow Exception : Undefined Request Params";
        }

        conn = await pool.getConnection();
        await conn.beginTransaction();

        const resultFollowListQuery = await conn.query(followListQuery);
        const rowFollowListQuery = resultFollowListQuery[0];

        

        if (ip.address() != config.url().ip) {
            rowFollowListQuery.forEach(row => {
                row.image_url = row.image_url.replace(config.url().ip, ip.address());
            });
        }

        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rowFollowListQuery));

    } catch (e) {

        console.log(e);

        await conn.rollback();
        
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();
        

    } finally {
        conn.release();
    }
});

router.get('/followerlist/:nickName', async (req, res) => {

    console.log("request Ip ( Get Follower List ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const nickName = req.params.nickName;

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    const followerListQuery = `select \
                                user.nick_name as nick_name, \
                                user.first_name as first_name, \
                                user.last_name as last_name, \
                                user.date_created as date_created, \
                                user.date_updated as date_updated, \
                                user.follow as follow, \
                                user.follower as follower, \
                                user.image_url as image_url, \
                                user.image_name as image_name \
                            from follow as fl \
                            INNER JOIN user \
                            ON fl.nick_name = user.nick_name \
                            where fl.dest_nick_name = '${nickName}' \
                            ORDER BY fl.id;`

    let conn;

    try {

        if (nickName == undefined) {
            throw "Follow Exception : Undefined Request Params";
        }

        conn = await pool.getConnection();
        await conn.beginTransaction();

        const resultFollowerListQuery = await conn.query(followerListQuery);
        const rowFollowerListQuery = resultFollowerListQuery[0];

        if (ip.address() != config.url().ip) {
            rowFollowerListQuery.forEach(row => {
                row.image_url = row.image_url.replace(config.url().ip, ip.address());
            });
        }

        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rowFollowerListQuery));

    } catch (e) {

        console.log(e);

        await conn.rollback();
        
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();
        

    } finally {
        conn.release();
    }
})

router.get('/forfollow/list/:nickName', async (req, res) => {

    console.log("request Ip ( Get Follow For Follow List ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const nickName = req.params.nickName;
    /*
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }
    */
    const f4fListQuery = `select \
                                user.nick_name as nick_name, \
                                fl.dest_nick_name as dest_nick_name, \
                                user.first_name as first_name, \
                                user.last_name as last_name, \
                                user.date_created as date_created, \
                                user.date_updated as date_updated, \
                                user.follow as follow, \
                                user.follower as follower, \
                                user.image_url as image_url, \
                                user.image_name as image_name \
                            from follow as fl \
                            INNER JOIN user \
                            ON (fl.nick_name = user.nick_name) \
                            ORDER BY fl.id;`


    let conn;

    try {

        if (nickName == undefined) {
            throw "Follow Exception : Undefined Request Params";
        }

        conn = await pool.getConnection();
        await conn.beginTransaction();

        const resultF4fListQuery = await conn.query(f4fListQuery);
        const rowF4FListQuery = resultF4fListQuery[0];

        if (ip.address() != config.url().ip) {
            rowF4FListQuery.forEach(row => {
                row.image_url = row.image_url.replace(config.url().ip, ip.address());
            });
        }
        
        let followList = [];
        let followerList = [];
        rowF4FListQuery.forEach(row => {
            if (row.nick_name == nickName && !(followList.includes(row.dest_nick_name)))
                followList.push(row.dest_nick_name);
            if (row.nick_name != nickName && !(followerList.includes(row.nick_name))){
                let {nick_name, first_name, last_name, date_created, date_updated, follow, follower, image_url, image_name} = row;
                followerList.push({
                    nick_name,
                    first_name,
                    last_name,
                    date_created,
                    date_updated,
                    follow,
                    follower,
                    image_url,
                    image_name
                });
            }
        });
        let f4f = []
        followerList.forEach( followerRow =>{
            if (followList.includes(followerRow.nick_name))
                f4f.push(followerRow);
        });

        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(f4f));

    } catch (e) {

        console.log(e);

        await conn.rollback();
        
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();
        

    } finally {
        conn.release();
    }
})

router.post('/', async (req, res) => {

    console.log("request Ip ( Post Follow ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    /*
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }
    */

    const {nick_name, dest_nick_name} = req.body;

    const followedQuery = `update user set follower = follower + 1 where nick_name = "${dest_nick_name}";`;
    const followingQuery = `update user set follow = follow + 1 where nick_name = "${nick_name}";`;
    const followCreateQuery = `insert into follow (nick_name, dest_nick_name) values('${nick_name}', '${dest_nick_name}');`;
    
    let conn;

    try {

        conn = await pool.getConnection();

        if (nick_name == undefined || dest_nick_name == undefined) {
            throw "Follow Exception : Undefined Request Body";
        }

        if (nick_name == dest_nick_name) {
            throw "Follow Exception : nick_name is equal to dest_nick_name";
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
        await conn.rollback();
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();

    } finally {

        conn.release();

    }

});

router.delete('', async (req, res) => {

    console.log("request Ip ( Delete follow ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    /*
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }
    */
    const {nick_name, dest_nick_name} = req.query;

    const followedQuery = `update user set follower = follower - 1 where nick_name = "${dest_nick_name}";`;
    const followingQuery = `update user set follow = follow - 1 where nick_name = "${nick_name}";`;
    const followDeleteQuery = `delete from follow where nick_name = '${nick_name}' and dest_nick_name = '${dest_nick_name}';`;

    let conn;

    try {

        conn = await pool.getConnection();

        if (nick_name == undefined || dest_nick_name == undefined) {
            throw "Follow Exception : Undefined Request Body";
        }

        if (nick_name == dest_nick_name) {
            throw "Follow Exception : nick_name is equal to dest_nick_name";
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
        console.log(e);
        await conn.rollback();
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();

    } finally {

        conn.release();

    }

});

module.exports = router;