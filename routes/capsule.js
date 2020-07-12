const express = require('express');
const fs = require('fs');
const mime = require('mime');
const multer = require('multer');
const path = require('path');
const config = require('../config/config')
const mysql = require('mysql2/promise');

const ip = { // 서버 공인아이피
    address () { return "59.13.134.140" }
};

const router = express.Router();
const pool = mysql.createPool(config.db());


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

    console.log("request Ip ( Get Capsule ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');    
    const query = "select capsule_id, \
                            user_id, \
                            nick_name, \
                            title, \
                            text, \
                            likes, \
                            views, \
                            date_created, \
                            date_opened, \
                            status_temp,\
                            y(location) as lat, x(location) as lng \
                            from capsule";

    let conn;

    try {

        conn = await pool.getConnection();

        const result = await conn.query(query); 
        let rows = result[0];

        //rows.unshift({"success":true});
        /*
        rows.forEach( row =>{
            let content = [];
            content.push({content_id: null, url: null});
            row.content = content;
        })
        */
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rows));

    } catch(e) {
        console.log(e)
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();
        //res.end('{"success": false}');
    } finally {
        conn.release();
    }
});

router.get('/location', async (req, res) => {

    console.log("request Ip ( Get Capsule within 100 meter ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const {lng, lat} = req.query;
    const query = `select *, U_ST_DISTANCE_SPHERE(POINT(${lng}, ${lat}), location) as Dist \
                    from capsule \
                    where U_ST_DISTANCE_SPHERE(POINT(${lng}, ${lat}), location) <= 0.01 \
                    order by Dist;`
    
    let conn;
    try {

        conn = await pool.getConnection();

        if (req.query.lng == undefined || req.query.lat == undefined)
            throw " Get-Query-Exception : need lng, lat ";

        const result = await conn.query(query);
        let rows = result[0];

        //rows.unshift({"success":true});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rows));
        
    } catch (e) {
        console.log(e)
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();
        //res.end('{"success": false}');
    } finally {
        conn.release();
    }
});
router.get('/nick/:nickName', async (req, res)=>{
    

    console.log("request Ip ( Get Capsules with nickName ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const nick_name = req.params.nickName;
    let conn;
    const query = `select cap.capsule_id, \
                            user_id, \
                            nick_name, \
                            title, \
                            text, \
                            likes, \
                            views, \
                            date_created, \
                            date_opened, \
                            status_temp, \
                            y(location) as lat, x(location) as lng, \
                            content_id, \
                            url \
                        from capsule as cap \
                        LEFT JOIN content as ct \
                        ON cap.capsule_id = ct.capsule_id \
                        where cap.nick_name = '${nick_name}' \
                        ORDER BY capsule_id DESC;`;

    try {

        conn = await pool.getConnection();
        
        const result = await conn.query(query);

        let rows = result[0];
        
        if (rows.length == 0) {

            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify([]));

        } else {

            let index = 0;
            let i = 0;
            let content = [];
            let capsules = [];
            let { capsule_id, user_id, nick_name, title, text, likes, views, date_created, date_opened, status_temp, lat, lng } = rows[0];
            capsules.push({
                capsule_id,
                user_id,
                nick_name,
                title,
                text,
                likes,
                views,
                date_created,
                date_opened,
                status_temp,
                lat,
                lng,
                content:null
            });
            rows.forEach( item => {
                
                if ( item.url != undefined && ip.address() != config.url().ip) {
                    if (ip.address() != config.url().ip) {
                        item.url = item.url.replace(config.url().ip, ip.address());
                    }
                }
                if (item != undefined) {
                    if (item.capsule_id == capsules[index].capsule_id ) {
                        content.push({
                            content_id: item.content_id,
                            url: item.url
                        });
                        if (rows.length - 1  == i) {
                            capsules[index].content = content;
                        }
                    } else {
                        capsules[index].content = content;
                        index = index + 1;
                        content = [];
    
                        capsules[index] = {
                            capsule_id: item.capsule_id,
                            user_id: item.user_id,
                            nick_name: item.nick_name,
                            title: item.title,
                            text: item.text,
                            likes: item.likes,
                            views: item.views,
                            date_created: item.date_created,
                            date_opened: item.date_opened,
                            status_temp: item.status_temp,
                            lat: item.lat,
                            lng: item.lng,
                            content:null
                        }
    
                        content.push({
                            content_id: item.content_id,
                            url: item.url
                        });
    
                        if (rows.length - 1  == i) {
                            capsules[index].content = content;
                        }
                    }
                }
                i = i + 1;
            });
                    //capsules.unshift({"success":true});
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify(capsules));
        }

    } catch (e) {
        console.log(e);

        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();
        //res.end('{"success": false}');
    } finally {
        conn.release();
    }
});
router.get('/:capsuleId', async (req, res) => { 

    
    console.log("request Ip ( Get a Capsule with capsule_id ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const query = `select cap.capsule_id, \
                                user_id, \
                                title, \
                                text, \
                                likes, \
                                views, \
                                date_created, \
                                date_opened, \
                                status_temp, \
                                y(location) as lat, x(location) as lng, \
                                content_id, \
                                url \
                            from capsule as cap \
                            JOIN content as ct \
                            ON cap.capsule_id = ct.capsule_id AND \
                            ct.capsule_id = ${req.params.capsuleId};`

    const query_temp_capsule = `select capsule_id, \
                                        user_id, \
                                        title, \
                                        text, \
                                        likes, \
                                        views, \
                                        date_created, \
                                        date_opened, \
                                        status_temp, \
                                        y(location) as lat, x(location) as lng \
                                        from capsule \
                                        where capsule_id = ${req.params.capsuleId} AND \
                                            status_temp = 1;`;

    let conn;

    try {

        conn = await pool.getConnection();

        if (req.params.capsuleId == undefined)
            throw "Get-URL-Capsule Exception - need capsuleId"

        
        let result = await conn.query(query);
        let result_temp = await conn.query(query_temp_capsule);
        let rows = result[0];
        let rows_temp = result_temp[0];
        let resJson = [];
        if (rows.length == 0 && rows_temp.length == 0)
            throw "Exception : Cant Find Capsule with capsule_id";

        if (rows.length != 0) {
            
            const {capsule_id, user_id, title, text, likes, views, date_created, date_opened, status_temp, lat, lng} = rows[0];
            let content = [];
            rows.forEach( item => {
                if ( item.url != undefined && ip.address() != config.url().ip) {
                    if (ip.address() != config.url().ip) {
                        item.url = item.url.replace(config.url().ip, ip.address());
                    }
                }
                content.push({content_id: item.content_id, url: item.url});
            });
    
            const rowsJson = {
                capsule_id,
                user_id,
                title,
                text,
                likes,
                views,
                date_created,
                date_opened,
                status_temp,
                lat,
                lng,
                content: content
            };
            resJson.push(rowsJson);
        } 
        
        if (rows_temp != 0) {
            //console.log(rows_temp);
            rows_temp.forEach( tempCapsule => {
                rows_temp[0].content = null;
                resJson.push(tempCapsule);
            });
        } 

        //console.log(resJson);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(resJson[0]));

        //console.log(temp);
        //resJson.unshift({"success":true});
    } catch(e) {
        console.log(e);

        res.writeHead(404, {'Content-Type':'application/json'});
        res.end();
        //res.end('{"success": false}');
    } finally {
        conn.release();
    }
});

// Capsule 임시저장
router.post('/', async (req,res) => {


    console.log("request Ip ( Post Temporal-Capsule ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    const { nick_name, lat, lng } = req.body; 
    let conn;

    try {

        conn = await pool.getConnection();
        
        if (nick_name == undefined || lat == undefined || lng == undefined) {
            throw {name: 'undefinedBodyException', message: "Post Capsule - Capsule_info not exist "};
        }

        if (lat > 90 || lat < -90 || lng > 180 || lng < -180)
            throw{name: 'lat_lng_Exception', message: "Post Capsule - this lat, lng is not correct"};
        const userIdQuery = `select user_id from user where nick_name = '${nick_name}';`;


        const idResult = await conn.query(userIdQuery);

        if (idResult[0].length == 0) {
            throw{name: 'Nick_Name_Error', message: "Post Capsule - this nick_name not exist"};
        }
        const rowId = idResult[0][0]
        const user_id = rowId.user_id;
        const query = `insert into capsule (user_id, nick_name, status_temp, location) 
        values('${user_id}', '${nick_name}', true, point(${lng}, ${lat}));`

        //console.log(query);
        await conn.beginTransaction();

        const insResult = await conn.query(query);
        //console.log(insResult);
        if (insResult[0].affectedRows == 0 )
            throw {name: 'insertNotCapsuleException', message: 'Post-Insert Not Capsule Exception'};

        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {
        await conn.rollback;

        if (e.name == 'undefinedBodyException') {
            console.log(e.message);
        } else {
            console.log(e.message);
        }
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }
    

});

// Capsule 저장
router.put('/with/images', upload.array("file"), async (req, res) => {


    console.log("request Ip ( Put Capsule with images ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    let conn;
    
    const filesInfo = req.files
    const capsule_id = req.body.capsule_id;
    let title = req.body.title;
    let text = req.body.text;
    
    // mysql ' " exception control
    title = title.replace("'","\\'").replace('"','\\"');

    let textQuery = null;
    if (text != undefined){
        text = text.replace("'","\\'").replace('"','\\"');
        textQuery = '\'' + text + '\'';
    }
    

    //console.log(filesInfo);
    try {

        conn = await pool.getConnection();
        //console.log(req.files[0]);
        //console.log(req.body.capsule_id);

        if (capsule_id == undefined || title == undefined || filesInfo == undefined ) {
            throw {name: 'undefinedBodyException', message: "Put Capsule - Capsule_info not exist"};
        }

        const status_temp = 0;

        let insertQuerys = "";

        const updateQuery = `update capsule SET \
                                title = '${title}', \
                                status_temp = ${status_temp}, \
                                text = ${textQuery} \
                                where capsule_id = ${capsule_id} AND \
                                status_temp = 1`;

        /*
        const capsule = {
            user_id,
            title,
            text,
            status_temp
        }
        */
       await filesInfo.forEach( item =>{

        const content_name = item.filename;
        const url = "http://"+ config.url().ip + ":" + config.url().port + "/contents/" + content_name;
        const extension = path.extname(item.originalname);
        const size = item.size;
        
        const content = {
            content_name,
            capsule_id,
            url,
            extension,
            size
        };
        
        const insertQuery = `insert into \
                                content (content_name, capsule_id, url, extension, size) \
                                value('${content_name}', '${capsule_id}', '${url}', '${extension}', '${size}'); `
        
        insertQuerys = insertQuerys + insertQuery;

        });
        // DB Transaction Start
        await conn.beginTransaction();
        const updResult = await conn.query(updateQuery);
        const insResult = await conn.query(insertQuerys);

        if (updResult[0].affectedRows == 0)
            throw {name: 'putCapsuleNotUpdateException', message: "Put Capsule-Not-Update Error"};
        
        insResult.forEach( result => {
            if(result == undefined)
                return;
            if (result.affectedRows == 0)
                throw {name: 'putCapsuleNotInsertException', message: "Put Capsule-Not-Insert Error"};
        })
        


        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {

        await conn.rollback();
        

        await filesInfo.forEach( item => {
            
            const filePath = item.path;
            
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) console.log('Cant delete files');
            })

            fs.unlink(filePath, (err) => err ?
            console.log(err) : console.log(`${filePath} is deleted !`));
            
        });

        console.log(e.message);

        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }

});

router.put('/', async (req, res) => {

    console.log("request Ip ( Put Capsule ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    let conn;
    
    const {capsule_id} = req.body;
    let {text} = req.body;
    let title = req.body.title;

    const status_temp = 0;
    
    // mysql ' " exception control
    title = title.replace("'","\\'").replace('"','\\"');

    let textQuery = null;
    if (text != undefined){
        text = text.replace("'","\\'").replace('"','\\"');
        textQuery = '\'' + text + '\'';
    }
        

    try {

        conn = await pool.getConnection();

        //console.log(req.files[0]);
        //console.log(req.body.capsule_id);

        if (capsule_id == undefined || title == undefined ) {
            throw {name: 'undefinedBodyException', message: "Put Capsule - Capsule_info not exist"};
        }

        

        const updateQuery = `update capsule SET \
                                title = '${title}', \
                                status_temp = ${status_temp}, \
                                text = ${textQuery} \
                                where capsule_id = ${capsule_id} AND \
                                status_temp = 1`;

        /*
        const capsule = {
            user_id,
            title,
            text,
            status_temp
        }
        */

        // DB Transaction Start
        await conn.beginTransaction();
        const updResult = await conn.query(updateQuery);

        if (updResult[0].affectedRows == 0)
            throw {name: 'putCapsuleNotUpdateException', message: "Put Capsule-Not-Update Error"};
        
        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {

        await conn.rollback();
        console.log(e.message);

        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }

});

router.delete('/:capsuleId', async (req,res) => {


    console.log("request Ip ( Delete Capsule with capsule_id ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    let conn;

    try {

        conn = await pool.getConnection();

        const capsule_id = req.params.capsuleId;

        selectQuery = `select content_name from content where capsule_id = ${capsule_id}; `;
        deleteQuery = `delete from capsule where capsule_id = ${capsule_id};`;
        
        await conn.beginTransaction();

        const result = await conn.query(selectQuery + deleteQuery);

        if (result[0][1].affectedRows == 0 )
            throw {name: 'cantDeleteCapsuleException', message: "Cant Delete this Capsule : Exception"};

        files = result[0][0];
        files.forEach( file => {
            let filePath = '';
            if (isImg(path.extname(file.content_name), result =>{
                return result;
            })) {
                filePath = path.join('public/images/', file.content_name);
            } else {
                filePath = path.join('public/videos/', file.content_name);
            }

            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) console.log('Cant delete files');
            });

            fs.unlink(filePath, (err) => err ?
            console.log(err) : console.log(`${filePath} is deleted !`));
        });
        /*(err,rows) => {
            if (err)
                console.log(err);
            else {

                    
                });
            }
        });
        */
       await conn.commit(); 
       res.writeHead(200, {'Content-Type':'application/json'});
       res.end('{"success": true}');
    } catch (e) {
        await conn.rollback();
        console.log(e);

        res.writeHead(404, {'Content-Type':'application/json'});
        //res.end();
        res.end('{"success": false}');

    } finally {
        conn.release();
    }
});

module.exports = router;