const express = require('express');
const fs = require('fs');
const mysql = require('mysql2/promise');
const config = require('../config/config.js');
const multer = require('multer');
const path = require('path');

const ip = { // 서버 공인아이피 
    address () { return config.url().newIp }
};

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

    const ss = `select * from sessions where data =`;
    try {

        conn = await pool.getConnection();

        
        const result = await conn.query(query);
        let rows = result[0];

        if (ip.address() != config.url().ip) {
            rows.forEach(row => {
                if(row.image_url != null && row.image_url.match(config.url().ip) !== null)
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

router.get('/nick/:nick_name', async (req, res) => {

    console.log("request Ip ( Get User/nick/:nick_name ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');
    
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

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
                    where nick_name = "${req.params.nick_name}";`;

    let conn;
    try {

        conn = await pool.getConnection();

        const result = await conn.query(query);
        let rows = result[0];

        if (rows.length == 0){
            throw "Exception : Cant Find User";
        }

        if (ip.address() != config.url().ip) {
            rows.forEach(row => {
                if (row.image_url != null)
                    row.image_url = row.image_url.replace(config.url().ip, ip.address());
            });
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

        if (ip.address() != config.url().ip) {
            rows.forEach(row => {
                row.image_url = row.image_url.replace(config.url().ip, ip.address());
            });
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
    
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

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

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

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
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}'); 
    } finally {
        conn.release();
    }

    
});

router.post('/auth', async (req, res) =>{


    console.log("request Ip ( Post Authorization ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');
    let {user_id, password} = req.body
    

    let conn;
    try {

        conn = await pool.getConnection();

        if (user_id == undefined || password == undefined){
            throw "Exception : Id, Password are undefined";
        }

        user_id = user_id.replace("'","\\'").replace('"','\\"');
        password = password.replace("'","\\'").replace('"','\\"');

        const query = `select nick_name from user where user_id = "${user_id}" and password = password("${password}");`;   

        const result = await conn.query(query);
        const rows = result[0];
        console.log(rows);
    
        if (rows.length == 0)
            throw "Exception : Incorrect Id, Password";

        req.session.nick_name = rows[0].nick_name;
        await req.session.save(()=> {
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify(rows[0]));
        })

    } catch(e) {
        console.log(e);
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}'); 

    } finally {
        conn.release();
    }

});

router.post('/logout', async (req, res) =>{

    console.log("request Ip ( Post Logout ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    try {


    if(req.session == undefined) {
        throw "Exception : sessions is undefined";
    }

    await req.session.destroy(err=>{
        throw "Exception : Failed Session Destruction";
    })

    res.writeHead(200, {'Content-Type':'application/json'});
    res.end('{"success": true}'); //json object로 변경

    } catch(e) {
        console.log(e);
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();
    //res.end('{"success": false}'); 
    } finally {
        conn.release();
    }

});


router.put('/', async (req, res) => {


    console.log("request Ip ( Put User ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    const {pre_nick_name, password, new_nick_name} = req.body;
    const query = `update user set \
    password = password("${password}"), \
    nick_name = "${new_nick_name}", \
    date_updated = now() \
    where nick_name = "${pre_nick_name}";`;

    let conn;

    try {
    
        conn = await pool.getConnection();

        await conn.beginTransaction();
     
        if(pre_nick_name == undefined || password == undefined || new_nick_name == undefined) {
            throw {name: 'undefinedBodyException', message: "Put User - user_info not exist"};
        }


        const result = await conn.query(query);
        const rows = result[0];
        if (rows.affectedRows == 0)
            throw "Exception : Cant Update User";
        
        await conn.commit();

        req.session.nick_name = new_nick_name;
        await req.session.save(()=>{
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end('{"success": true}'); 
        });
        
    } catch (e) {
        await conn.rollback();
        console.log(e);
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}'); 
    } finally {
        conn.release();
    }

});

router.put('/image', upload.single("file") ,async (req, res) =>{

    console.log("request Ip ( Put User with image ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');
    
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    const fileInfo = req.file;
    const {pre_nick_name, password, new_nick_name} = req.body;
    const fileName = fileInfo.filename;
    const fileUrl = "http://" + config.url().ip + ":" + config.url().port.toString() +
                    "/contents/" + fileName;

    let conn;

    const query = `update user set \
    password = password("${password}"), \
    nick_name = "${new_nick_name}", \
    date_updated = now(), \
    image_url = "${fileUrl}", \
    image_name = "${fileName}" \
    where nick_name = "${pre_nick_name}";`;

    const selectQuery = `select image_url, image_name from user where nick_name = '${pre_nick_name}';`;

    try {

        conn = await pool.getConnection();

        await conn.beginTransaction();

        if(pre_nick_name == undefined || password == undefined || new_nick_name == undefined || fileInfo == undefined) {
                throw {name: 'undefinedBodyException', message: "Put User With Image - user_info not exist"};
        }

        /*
            특수문자 예외 처리 필요한 부분
        */
        
        const selectResult = await conn.query(selectQuery);
        const selectRows = selectResult[0];
        
        if(selectRows.length == 0) {
            throw "Exception : Cant Find User";
        }

        const preFileName = selectRows[0].image_name;

        const result = await conn.query(query);
        const rows = result[0];
        
        if (rows.affectedRows == 0)
            throw "Exception : Cant Insert User";

        if (preFileName != undefined && preFileName != null) {
            const preFilePath = `public/images/${preFileName}`;
            fs.access(preFilePath, fs.constants.F_OK, (err) =>{
                if (err) throw {name: 'cantDeleteUserImageException', message: "Cant Delete this UserImage"};
            });

            fs.unlink(preFilePath, (err) => {
                if (err)
                    throw {name: 'cantDeleteUserImageException', message: "Cant Delete this UserImage"}
                else
                    console.log(`${preFilePath} is deleted !`);
            });
        } 

        req.session.nick_name = new_nick_name;
        await req.session.save(()=>{
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end('{"success": true}'); 
        });

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

router.delete('/:nick_name', async (req, res) =>{

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    console.log("request Ip ( Delete User ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const selectUserQuery = `select image_name from user \
                             where nick_name = "${req.params.nick_name}";`;
    const deleteUserQuery = `delete from user \
                    where nick_name="${req.params.nick_name}"`;
    
    let conn;

    try {

        conn = await pool.getConnection();

        await conn.beginTransaction();

        const selectResult = await conn.query(selectUserQuery);
        const selectRows = selectResult[0];
        
        if (selectRows.length == 0 )
            throw "DeleteUserException : Cant Find User";
        
        const fileName = selectRows[0].image_name;

        /*  select user image url and delete the image file */ 

        const deleteResult = await conn.query(deleteUserQuery);
        const deleteRows = deleteResult[0];

        if (deleteRows.affectedRows == 0 )
            throw {name: 'cantDeleteUserException', message: "Cant Delete this User"};


        if (fileName != undefined && fileName != null) {
            const filePath = `public/images/${fileName}`;
            fs.access(filePath, fs.constants.F_OK, (err) =>{
                if (err) throw {name: 'cantDeleteUserImageException', message: "Cant Delete this UserImage"};
            });

            fs.unlink(filePath, (err) => {
                if (err)
                    throw {name: 'cantDeleteUserImageException', message: "Cant Delete this UserImage"}
                else
                    console.log(`${filePath} is deleted !`);
            });
        } 

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
