const express = require('express');
const fs = require('fs');
const mime = require('mime');
//const queryString = require('querystring');
const multer = require('multer');
const path = require('path');
const config = require('../config/config')
const mysql = require('mysql2/promise');


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
    const query = "select capsule_id, \
                            user_id, \
                            title, \
                            likes, \
                            views, \
                            date_created, \
                            date_viewed, \
                            status_temp,\
                            y(location) as lat, x(location) as lng \
                            from capsule";

    console.log(req.query);

    const conn = await pool.getConnection();

    try {
        const result = await conn.query(query); 
        let rows = result[0];    
        rows.unshift({"success":true});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rows));

    } catch(e) {
        console.log(e)
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }
});

router.get('/location', async (req, res) => {
    
    const query = `select *, U_ST_DISTANCE_SPHERE(POINT(${req.query.lng}, ${req.query.lat}), location) as Dist \
                    from capsule \
                    where U_ST_DISTANCE_SPHERE(POINT(${req.query.lng}, ${req.query.lat}), location) <= 5 \
                    order by Dist;`
    const conn = await pool.getConnection();

    try {

        if (req.query.lng == undefined || req.query.lat == undefined)
            throw " Get-Query-Exception : need lng, lat ";

        const result = await conn.query(query);
        let rows = result[0];
        rows.unshift({"success":true});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rows));
        
    } catch (e) {
        console.log(e)
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }
});

router.get('/:capsuleId', async (req, res) => { 

    const query = `select cap.capsule_id, \
                                user_id, \
                                title, \
                                likes, \
                                views, \
                                date_created, \
                                date_viewed, \
                                status_temp, \
                                y(location) as lat, x(location) as lng, \
                                content_id, \
                                url \
                                from capsule as cap \
                                JOIN content as ct \
                                ON cap.capsule_id = ct.capsule_id AND \
                                ct.capsule_id = ${req.params.capsuleId};`
    
    const conn = await pool.getConnection();

    try {

        if (req.params.capsuleId == undefined)
            throw "Get-URL-Capsule Exception - need capsuleId"

        const result = await conn.query(query);
        console.log(result[0]);
        let rows = result[0];
        rows.unshift({"success":true});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rows));

    } catch(e) {
        console.log(e);

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }
});

// Capsule 임시저장
router.post('/', async (req,res) => {

    const conn = await pool.getConnection();

    try {
        
        if (req.body.user_id == undefined || req.body.lat == undefined || req.body.lng == undefined) {
            throw {name: 'undefinedBodyException', message: "Post Capsule - Capsule_info not exist "};
        }
        const query = `insert into capsule (user_id, status_temp, location) values('${req.body.user_id}',\
         true, point(${req.body.lng}, ${req.body.lat}));`

        await conn.beginTransaction();

        const insResult = await conn.query(query);
        console.log(insResult);
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
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }
    

});

// Capsule 저장
router.put('/', upload.array("file"), async (req, res) => {

    const conn = await pool.getConnection();

    try {
        //console.log(req.files[0]);
        //console.log(req.body.capsule_id);

        if (req.body.capsule_id == undefined || req.body.title == undefined ) {
            throw {name: 'undefinedBodyException', message: "Put Capsule - Capsule_info not exist"};
        }

        const capsule_id = req.body.capsule_id;
        const title = req.body.title;
        const status_temp = 0;
        let text = null;
        let insertQuerys = "";

        if (req.body.text != undefined)
            text = req.body.text;
        const updateQuery = `update capsule SET \
                                title = '${title}', \
                                status_temp = ${status_temp}, \
                                text = ${text} \
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
       await req.files.forEach( file =>{

        const content_name = file.filename;
        const url = config.url().ip + ":" + config.url().port + "/contents/" + content_name;
        const extension = path.extname(file.originalname);
        const size = file.size;
        
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
            if (result.affectedRows)
                throw {name: 'putCapsuleNotInsertException', message: "Put Capsule-Not-Update Error"};
        })
        
        console.log(updResult);
        console.log(insResult);

        await conn.commit();

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {

        await conn.rollback();
        

        req.files.forEach( file => {
            
            let filePath = '';
            if (isImg(file.extension, result =>{
                return result;
            })) {
                filePath = path.join('public/images/', file.filename);
            } else {
                filePath = path.join('public/videos/', file.filename);
            }

            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) console.log('Cant delete files');
            })

            fs.unlink(filePath, (err) => err ?
            console.log(err) : console.log(`${filePath} is deleted !`));
            
        });

        console.log(e.message);
        /*
        if (e.name == 'putCapsuleNotUpdateException') {
            console.log(e.message);
        } else if (e.name == 'putCapsuleNotInsertException') {
            // delete inserted contents
            // return updated capsules
            console.log(e.message);
        } else if (e.name == 'sqlUpdateError') {
            console.log(e.message);
        } else if  (e.name == 'sqlInsertError') {
            console.log(e.message);
            // delete inserted contents
            // return updated capsules
        } else if (e.name == 'undefinedBodyException') {
            console.log(e.message);
        } else {
            console.log(e.message);
        }
        */

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }

});

router.delete('/:capsuleId', async (req,res) => {

    const conn = await pool.getConnection();

    try {
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
            })

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

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');

    } finally {
        conn.release();
    }
});

module.exports = router;