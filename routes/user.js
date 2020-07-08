const express = require('express');
const fs = require('fs');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const pool = mysql.createPool(config.db());

// file upload object

function isImg(extension, callback){
    if ( extension == ".png" || extension == ".bmp" || extension == ".jpg" ||
    extension == ".jpeg" || extension == ".webp" || extension == ".gif" ) {
        return callback(true);
    } else {
        return callback(false);
    }
};

const storage = multer.diskStorage({
    // Path 콜백
    destination : (req, file, callback) => {
            
        if ( isImg((path.extname(file.originalname)), result => {
            return result
        })) {
            callback(null, 'public/images/');   
        } else {
            callback(null, 'public/videos/');
        }
           
    },

    limits: (res ,req) => {
        // image-size limit
        if ( isImg((path.extname(file.originalname)), result => {
            return result
        })) {
            fileSize: 5 * 1024 * 1024 // limit: 5MB
        } else { // video-size limit
            fileSize: 20 * 1024 * 1024 // limit: 20MB
        }
    },
    // Stored fileName
    filename : (req, file, callback) => {
        // 파일명 설정을 돕기 위해 확장자 추출
        const extension = path.extname(file.originalname);
        
        // 시간 + 확장자를 파일명으로 콜백
        callback(null, Date.now()+extension);
    }
});

const upload = multer({
    storage: storage
});


router.get('/', async (req, res) => {


    console.log("request Ip ( Get User ):",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');
    
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

router.get('/nick/:nick_name', async (req, res) => {


    console.log("request Ip ( Get User/nick/:nick_name ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const query = `select user_id, \
                        nick_name, \
                        first_name, \
                        last_name, \
                        email_id, \
                        email_domain,
                        date_created, \
                        date_updated, \
                        follow, \
                        follower, \
                        image_url, \
                        image_name \
                    from user \
                    where user_id = "${req.params.nick_name}";`;

    let conn;

    try {

        conn = await pool.getConnection();

        const result = await conn.query(query);
        let rows = result[0];

        if (rows.length == 0){
            throw "Exception : Cant Find User";
        }

        //rows.unshift({"success":true});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rows[0])); //json object로 변경

    } catch (e) {
        console.log(e);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end();
        //res.end('{"success": false}'); 
    } finally {
        conn.release();
    }
    
});

router.get('/:id', async (req, res) => {


    console.log("request Ip ( Get User/:id ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const query = `select user_id, \
                        nick_name, \
                        first_name, \
                        last_name, \
                        email_id, \
                        email_domain,
                        date_created, \
                        date_updated, \
                        follow, \
                        follower, \
                        image_url, \
                        image_name \
                    from user \
                    where user_id = "${req.params.id}";`;

    let conn;

    try {

        conn = await pool.getConnection();

        const result = await conn.query(query);
        let rows = result[0];

        if (rows.length == 0){
            throw "Exception : Cant Find User";
        }

        //rows.unshift({"success":true});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rows[0])); //json object로 변경

    } catch (e) {
        console.log(e);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end();
        //res.end('{"success": false}'); 
    } finally {
        conn.release();
    }
    
});


router.post('/with/image', upload.single("file") ,async (req, res) =>{

    console.log("request Ip ( Post User with image ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');
    
    const fileInfo = req.file;
    const {user_id, password, nick_name, first_name, last_name, email} = req.body;
    const fileName = fileInfo.filename;
    const fileUrl = "http://" + config.url().ip + ":" + config.url().port.toString() +
                    "/contents/" + fileName;

    let email_id;
    let email_domain;
    if (email != undefined){
        email_id = email.split("@")[0];
        email_domain = email.split("@")[1];
    }


    let conn;

    const query = `insert into user (user_id, \
                                    password, \
                                    nick_name, \
                                    first_name, \
                                    last_name,
                                    image_url,
                                    image_name,
                                    email_id,
                                    email_domain) \
                                    values( \
                                        "${user_id}", \
                                        password("${password}"), \
                                        "${nick_name}", \
                                        "${first_name}", \
                                        "${last_name}",
                                        "${fileUrl}",
                                        "${fileName}",
                                        "${email_id}",
                                        "${email_domain}");`;
    try {

        conn = await pool.getConnection();

        await conn.beginTransaction();

        if(user_id == undefined || password == undefined || nick_name == undefined
            || first_name == undefined || last_name == undefined || email == undefined ) {
                throw {name: 'undefinedBodyException', message: "Post User - user_info not exist"};
        }

        /*
            특수문자 예외 처리 필요한 부분
        */
        
        const result = await conn.query(query);
        const rows = result[0];
        
        if (rows.affectedRows == 0)
            throw "Exception : Cant Insert User";

        await conn.commit();
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}'); 

    } catch (error) {
        console.log(error);
        if (fileInfo != undefined) {
            const filePath = fileInfo.path;
            fs.access(filePath, fs.constants.F_OK, (err) =>{
                if (err) console.log('Cant delete files');
            });

            fs.unlink(filePath, (err) => err ?
            console.log(err) : console.log(`${filePath} is deleted !`));

        }   

        await conn.rollback();
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();
    } finally {
        conn.release();
    }


});

router.post('/', async (req, res) => {
    

    console.log("request Ip ( Post User ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    //console.log(req.body);
    const {user_id, password, nick_name, first_name, last_name, email} = req.body;
    let email_id;
    let email_domain;
    if (email != undefined){
        email_id = email.split("@")[0];
        email_domain = email.split("@")[1];
    }
    
    const query = `insert into user (user_id, \
                                    password, \
                                    nick_name, \
                                    first_name, \
                                    last_name,  \
                                    email_id,  \
                                    email_domain) \
                                values( \
                                    "${user_id}", \
                                    password("${password}"), \
                                    "${nick_name}", \
                                    "${first_name}", \
                                    "${last_name}", \
                                    "${email_id}", \
                                    "${email_domain}");`;
    
    let conn;                                
    
    try {

        conn = await pool.getConnection();

        await conn.beginTransaction();

        /*
            특수문자 예외 처리 필요한 부분
        */

        if(user_id == undefined || password == undefined || nick_name == undefined
            || first_name == undefined || last_name == undefined) {
                throw {name: 'undefinedBodyException', message: "Post User - user_info not exist"};
        }


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


    console.log("request Ip ( Post Authorization ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const query = `select user_id from user where user_id = "${req.body.user_id}" and password = password("${req.body.password}");`;   
    let conn;

    try {
        
        conn = await pool.getConnection();

        const result = await conn.query(query);
        const rows = result[0];
        console.log(rows);
    
        if (rows.length == 0)
            throw "Exception : Incorrect Id, Password";

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}'); 

    } catch(e) {
        console.log(e);
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}'); 

    } finally {
        conn.release();
    }

});

router.put('/', async (req, res) => {


    console.log("request Ip ( Put User ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const {password, nick_name, first_name, last_name, user_id} = req.body;
    const query = `update user set \
    password = password("${password}"), \
    nick_name = "${nick_name}", \
    first_name = "${first_name}", \
    last_name = "${last_name}", \
    date_updated = now() \
    where user_id = "${user_id}";`;

    let conn;

    try {
    
        conn = await pool.getConnection();

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


    console.log("request Ip ( Delete User ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const query = `delete from user \
                    where user_id="${req.params.id}"`;
    
    let conn;

    try {

        conn = await pool.getConnection();

        await conn.beginTransaction();

        const result = await conn.query(query);
        const rows = result[0];
        if (rows.affectedRows == 0 )
            throw "Exception : Cant Delete User";
        
        /*  select user image url and delete the image file */ 

        /*  select user image url and delete the image file */ 

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
