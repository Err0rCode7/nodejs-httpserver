const express = require('express');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');

const ip = { // 서버 공인아이피
    address () { return config.url().newIp }
};

const router = express.Router();
const pool = mysql.createPool(config.db());

router.get('/list/:capsuleId', async (req, res) => {

    console.log("request Ip ( Get Comment List ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    /*
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }
    */
    

    const capsule_id = req.params.capsuleId;
    const selectCommentListQuery = `select \
                                    c.nick_name as parent_nick_name, \
                                    r.nick_name as child_nick_name, \
                                    c.comment as parent_comment, \
                                    r.comment as child_comment, \
                                    c.date_created as parent_date_created, \
                                    c.date_updated as parent_date_updated, \
                                    r.date_created as child_date_created, \
                                    r.date_updated as child_date_updated, \
                                    pu.image_url as parent_image_url, \
                                    cu.image_url as child_image_url
                                    from comment as c \
                                    LEFT JOIN reply r \
                                    ON c.id = r.parent_id \
                                    LEFT JOIN user pu \
                                    ON pu.nick_name = c.nick_name \
                                    LEFT JOIN user cu \
                                    ON cu.nick_name = r.nick_name \
                                    where c.capsule_id = ${capsule_id} \
                                    ORDER BY c.id , \
                                    r.id;`;

    let conn;

    try {

        conn = await pool.getConnection();

        if (capsule_id == undefined) {
            throw "Comment Exception : Undefined Request Body";
        }
        
        await conn.beginTransaction();

        const resultSelectCommentListQuery = await conn.query(selectCommentListQuery);
        const rowCommentList = resultSelectCommentListQuery[0];

        let count = 0;

        await conn.commit();

        let childList = [];
        let commentList = [];
        let temp_parent_nick;
        let temp_parent_comment;
        let temp_parent_date_created;
        let temp_parent_date_updated;
        let temp_parent_image_url;

        rowCommentList.forEach( item => {

            if ( item.parent_image_url != undefined && ip.address() != config.url().ip) {
                if (ip.address() != config.url().ip) {
                    item.parent_image_url = item.parent_image_url.replace(config.url().ip, ip.address());
                }
            }

            if ( item.child_image_url != undefined && ip.address() != config.url().ip) {
                if (ip.address() != config.url().ip) {
                    item.child_image_url = item.child_image_url.replace(config.url().ip, ip.address());
                }
            }

            const {parent_nick_name, 
                child_nick_name, 
                parent_comment, 
                child_comment,
                parent_date_created, 
                parent_date_updated, 
                child_date_created, 
                child_date_updated,
                parent_image_url,
                child_image_url} = item;

            if (count == 0){
                // No Reply
                childList = [];
                if (child_nick_name == null){
                    commentList.push({
                        nick_name: parent_nick_name,
                        comment: parent_comment,
                        date_created: parent_date_created,
                        date_updated: parent_date_updated,
                        user_image_url: parent_image_url,
                        replies: childList
                    });

                } else {

                    temp_parent_nick = parent_nick_name;
                    temp_parent_comment = parent_comment;
                    temp_parent_date_created = parent_date_created;
                    temp_parent_date_updated = parent_date_updated;
                    temp_parent_image_url = parent_image_url;
                    childList.push({
                        nick_name: child_nick_name,
                        comment: child_comment,
                        date_created: child_date_created,
                        date_updated: child_date_updated,
                        user_image_url: child_image_url
                    });
                    count++;
                }
            } else {

                if (child_nick_name == null){
                    commentList.push({
                        nick_name: temp_parent_nick,
                        comment: temp_parent_comment,
                        date_created: temp_parent_date_created,
                        date_updated: temp_parent_date_updated,
                        user_image_url: temp_parent_image_url,
                        replies: childList
                    });
                    commentList.push({
                        nick_name: parent_nick_name,
                        comment: parent_comment,
                        date_created: parent_date_created,
                        date_updated: parent_date_updated,
                        user_image_url: parent_image_url,
                        replies: []
                    })
                    count = 0;

                } else {

                    temp_parent_nick = parent_nick_name;
                    temp_parent_comment = parent_comment;
                    temp_parent_date_created = parent_date_created;
                    temp_parent_date_updated = parent_date_updated;
                    temp_parent_image_url = parent_image_url;
                    childList.push({
                        nick_name: child_nick_name,
                        comment: child_comment,
                        date_created: child_date_created,
                        date_updated: child_date_updated,
                        user_image_url: child_image_url,
                    });
                    count++; 
                }
            }

        });
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(commentList));

    } catch (e) {

        console.log(e)

        await conn.rollback();
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();

    } finally {

        conn.release();

    }

});

router.post('/', async (req, res) => {

    console.log("request Ip ( Post Comment ) :",req.connection.remoteAddress.replace('::ffff:', ''));

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    const {user_id, nick_name, capsule_id, comment, parent_id} = req.body;

    const createCommentQuery = `insert into comment ( capsule_id, comment, nick_name, date_created ) \
                                values( ${capsule_id}, '${comment}', '${nick_name}', now());`;
    const createChildCommentQuery = `insert into reply ( capsule_id, parent_id, comment, nick_name, date_created ) \
                                values( ${capsule_id}, ${parent_id} ,'${comment}', '${nick_name}', now());`;
    let conn;
    let query;

    try {

        conn = await pool.getConnection();

        if ( capsule_id == undefined || comment == undefined || nick_name == undefined) {
            throw "Comment Exception : Undefined Request Body";
        }

        if (comment.length >= 400) {
            throw "Commnet Exception : Comment's length is too long ";
        }

        if (parent_id == undefined) {
            query = createCommentQuery;        
        } else {
            query = createChildCommentQuery;
        }

        await conn.beginTransaction();

        const resultCreateComment = await conn.query(query);

        const rowCreateComment = resultCreateComment[0];

        if (rowCreateComment.affectedRows == 0){
            throw "Follow Exception : Cant Create Comment";
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

router.delete('/:id', async (req, res) => {

    console.log("request Ip ( Deleting Comment ) :",req.connection.remoteAddress.replace('::ffff:', ''));

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    const id = req.params.id;
    const deleteCommentQuery = `delete from comment where id = ${id};`;

    let conn;

    try {

        conn = await pool.getConnection();

        if (id == undefined) {
            throw "Comment Exception : Undefined Request Body";
        }
        
        await conn.beginTransaction();

        const resultDeleteComment = await conn.query(deleteCommentQuery);
        const rowDeleteComment = resultDeleteComment[0];

        if (rowDeleteComment.affectedRows == 0){
            throw "Follow Exception : Comment not exist";
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

router.delete('/reply/:id', async (req, res) => {

    console.log("request Ip ( Delete Reply Comment ) :",req.connection.remoteAddress.replace('::ffff:', ''));

    const id = req.params.id;
    const deleteReplyQuery = `delete from reply where id = ${id};`;

    let conn;

    try {

        conn = await pool.getConnection();

        if (id == undefined) {
            throw "Comment Exception : Undefined Request Body";
        }
        
        await conn.beginTransaction();

        const resultDeleteReply = await conn.query(deleteReplyQuery);
        const rowDeleteReply = resultDeleteReply[0];

        if (rowDeleteReply.affectedRows == 0){
            throw "Follow Exception : Reply Not exist";
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