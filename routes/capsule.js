const express = require('express');
const fs = require('fs');
const mime = require('mime');
//const queryString = require('querystring');
const multer = require('multer');
const path = require('path');
const config = require('../config/config')
const mysql = require('mysql');


const router = express.Router();

const connection = mysql.createConnection(config.db());
connection.connect( (err) => {
    if(err) {
        console.log('capsule router : ' + err);
        return;
    }
});



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


router.get('/', (req, res) => { 
    const query = "select capsule_id, user_id, title, likes, views, date_created, date_viewed, status_temp,\
    y(location) as lat, x(location) as lng from capsule";
    console.log(req.query);
    try {
        connection.query(query, (err,rows) => {
            console.log(rows);
            if (err) {
                console.log('Capsule Get-all Query Error : '+err);
                throw err;
            } else {
                rows.unshift({"success":true});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(rows));
            }
            
        });
    } catch {
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    }
});

router.get('/location', (req, res) => {
    console.log(req.query);
    const query = `select *, U_ST_DISTANCE_SPHERE(POINT(${req.query.log}, ${req.query.lat}), location) as Dist \
    from capsule where U_ST_DISTANCE_SPHERE(POINT(${req.query.log}, ${req.query.lat}), location) <= 100 order by Dist;`

    try {
        connection.query(query, (err, rows) =>{
            if (err) {
                console.log("Capsule Get-location Query Error : "+err);
                throw new Error();
            } else if (rows) {
                rows.unshift({"success":true});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(rows));
            } else {
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end('{"success": false}');
            }

        });
    } catch {
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    }
});

router.get('/content/:capsuleId', (req, res) => { 

    const query = `select cap.capsule_id, user_id, title, likes, views, date_created, date_viewed, status_temp,\
     y(location) as lat, x(location) as lng, content_id ,url from capsule as cap JOIN content as ct ON cap.capsule_id = ct.capsule_id AND ct.capsule_id = ${req.params.capsuleId};`
    console.log(query);
    try {
        connection.query(query, (err,rows) => {
            if (err) {
                console.log('Capsule Get one with content Error : '+err);
                throw new Error();
            } else if (rows) {
                rows.unshift({"success":true});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(rows));
            } else {
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end('{"success": false}');
            }
        })
    } catch {
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    }
});
/*
router.post('/temp', (req,res) => {
    const user_id;
    const lat;
    const lng;

})
router.post('/', (req,res) => {
    const user_id;
    const title;
    const 
});
*/
router.post('/', upload.array("file"), (req, res) => {
    
    try {

        //console.log(req.files[0]);
        //console.log(req.body.capsule_id);
        if (req.body.capsule_id == undefined || req.body.user_id == undefined ||
            req.body.title == undefined ) {
            console.log("Post Contents - Capsule_info not exist ");
            throw new Error();
        }
        const capsule_id = req.body.capsule_id;
        const user_id = req.body.user_id;
        const title = req.body.title;
        const status_temp = 0;
        let text = null;
        let sqlError = null;
        let affectedFlag = false;
        //const jsonQ = {"success":false};


        if (req.body.text != undefined)
            text = req.body.text;
        const query_update = `update capsule SET user_id = '${user_id}', title = '${title}', status_temp = ${status_temp}, text = ${text} where capsule_id = ${capsule_id} AND status_temp = 1`;
        console.log(query_update);
        /*
        const capsule = {
            user_id,
            title,
            text,
            status_temp
            
        }
        */
        // 캡슐 업데이트(임시저장 -> 저장) 쿼리 실행
        
        connection.query(query_update, (err, rows) => {
            if (err) {
                //console.log("Post Capsule-Update Query Error : "+err);
                sqlError = "Post Capsule-Update Query Error : "+err;
            } else {
                if (rows.affectedRows >= '1')
                {
                    affectedFlag = true;
                }
            }
        });
        
        // sql Error Handling
        if (!(sqlError == null)) {
            throw {name: 'sqlUpdateError', message: sqlError}
        } else if (affectedFlag) {
            console.log("Capsule-Update Query Success");
        } else {
            console.log("Post Capsule-Not-Update Error");
            throw {name: 'postCapsuleNotUpdateException', message: "Post Capsule-Not-Update Error"};
        }

        
        // 캡슐 외래키 content 쿼리 실행
        req.files.forEach( file =>{
            affectedFlag = false;
            const content_name = file.filename;
            //const capsule_id = req.body.capsule_id;
            const url = config.url().ip + ":" + config.url().port + "/contents/" + content_name;
            const extension = path.extname(file.originalname);
            const size = file.size;
            //const id = req.body.id;

            /*
            const content = {
                //id,
                content_name,
                capsule_id,
                url,
                extension,
                size
            };
            */

            const query_insert = `insert into content (content_name, capsule_id, url, extension, size) value('${content_name}', '${capsule_id}', '${url}', '${extension}', '${size}');`
            connection.query(query_insert, (err,rows) =>{
                if (err) {
                    //console.log("Capsule-Content Post Query Error :" +err);
                    sqlError = "Capsule-Content Post Query Error :" +err;
                } else {
                    console.log("Capsule-Content Post Query Success");
                }
            });

            // sql Error Handling
            if (!(sqlError == null)) {
                throw {name: 'sqlInsertError', message: sqlError}
            } else if (affectedFlag) {
                console.log("Capsule-Update Query Success");
            } else {
                throw {name: 'postCapsuleNotInsertException', message: "Post Capsule-Not-Update Error"}
            }

        });

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {
        //console.log(e);
        
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

        if (e.name == 'postCapsuleNotUpdateException') {
            console.log(e.message);
        } else if (e.name == 'postCapsuleNotInsertException') {
            // delete inserted contents
            // return updated capsules
            console.log(e.message);
        } else if (e.name == 'sqlUpdateError') {
            console.log(e.message);
        } else if  (e.name == 'sqlInsertError') {
            console.log(e.message);
            // delete inserted contents
            // return updated capsules
        }
            

        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    }

});

module.exports = router;