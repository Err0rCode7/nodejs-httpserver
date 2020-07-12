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

/*
const connection = mysql.createConnection(config.db());
connection.connect( (err) => {
    if(err) {
        console.log('content router : ' + err);
        return;
    }
});
*/

// ImageType ( Post )
/*
const content = {
    id, // number for order
    content_name, // data.now().extension
    capsule_id, // select key 
    uri, // get image uri
    extension, // file extension
    size // file size
};
*/

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

// Get contents

router.get('/capsule-id/:capsuleId', async (req, res) => {


    console.log("request Ip ( Get contents with capsuleId ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    console.log(req.params.capsuleId);
    let conn;

    const capsuleId = req.params.capsuleId;
    const query = `select * from content where capsule_id = ${capsuleId};`;

    try {

        conn = await pool.getConnection();

        const result = await conn.query(query);
        let rows = result[0];
        //rows.unshift({"success":true});
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(rows))

    } catch(e) {
        console.log(e);
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }
});


// Get contents

router.get('/:content_name', (req, res, next) => {


    console.log("request Ip ( Get content with contentId ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    try{
        const content_name = req.params.content_name;
        if (content_name == undefined) {
            throw Error('Undefined content_name');
        }
        let contentPath = "";
        console.log((path.extname(content_name)));
        if ( isImg((path.extname(content_name)), result => {
            return result
        })) {
            contentPath = './public/images/'+content_name;    
        } else {
            contentPath = './public/videos/'+content_name;
        }
        const contentMime = mime.getType(contentPath);
        //console.log('contentPath: '+ contentPath);
        //console.log('contentMime: '+ contentMime);

        /*
        // Send readFile 동기식
        fs.readFile(imgPath, (error, data) => {
            if (error){
                console.log('Page not found 404 : ' + error);
                res.writeHead(500, {'Content-Type':'text/html'});
                res.end('500 Internal Server ' +error);
            }else{
                res.writeHead(200, {'Content-Type':imgMime});
                res.end(data);
            }            
            
        });
        */

        const stream = fs.createReadStream(contentPath);
        //let count = 0;
        stream.on('data', (data) => {
            
            //console.log('content data count= '+ (count = count+1));
            res.write(data);
        });
        
        stream.on('end', () => { 
            console.log('end streaming')
            res.end();
        })
        stream.on('error', (error) => {
            res.writeHead(404, {'Content-Type':'application/json'});
            res.end('{"success": false, "error": "internal error"}');
        });

    } catch(error) {
        console.log(error);
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    }
});

// post contents ( upload image-form data )
//      multer 는 헤더에 content-type:x-www-form-urlencoded 를 사용하지 않고 multipart/form-data를 사용한다.
router.post('/', upload.array("file"), async (req, res) => {


    console.log("request Ip ( Post Content ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    let conn;

    try{

        conn = await pool.getConnection();

        //console.log(req.files[0]);
        //console.log(req.body.capsule_id);

        let querys = "";
        if(req.body.capsule_id == undefined) {
            throw {name: "postIdNotExistException", message: "Post Contents - Capsule_id not exist"};
        }
        await req.files.forEach( file =>{

            const content_name = file.filename;
            const capsule_id = req.body.capsule_id;
            const url = "http://" + config.url().ip + ":" + config.url().port + "/contents/" + content_name;
            const extension = path.extname(file.originalname);
            const size = file.size;
            //const id = req.body.id;
            const content = {
                //id,
                content_name,
                capsule_id,
                url,
                extension,
                size
            };
            const query = `insert into content \
                    (content_name, capsule_id, url, extension, size) \
            value('${content_name}', '${capsule_id}', '${url}', '${extension}', '${size}');`
            querys = querys + query;
        });

        const results = await conn.query(querys);
        
        results.forEach( result => {
            console.log(result);
            if(result == undefined)
                return;
            if(result.affectedRows == 0 )
                throw {name: "insertNotException", message: "Insert Not Contents"};
        })

        await conn.commit();
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {
        //console.log(error);
        await conn.rollback();

        req.files.forEach( file => {
            const filePath = file.path
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) console.log('Cant delete files');
            })

            fs.unlink(filePath, (err) => err ?
            console.log(err) : console.log(`${filePath} is deleted !`));
        });

        console.log(e);

        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }

});

router.put('/', (req, res) =>{


    console.log("request Ip ( Put Content ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    res.writeHead(404, {'Content-Type':'text/html'});
    res.end('404 Page Not Found');
});

router.delete('/:contentName', async (req, res) =>{


    console.log("request Ip :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');
    
    const content_name = req.params.contentName;
    const query = `delete from content where content_name = '${content_name}';`;    
    let conn;

    try {

        conn = await pool.getConnection();

        let filePath = '';
        if (isImg(path.extname(content_name), result =>{
            return result;
        })) {
            filePath = path.join('public/images/', content_name);
        } else {
            filePath = path.join('public/videos/', content_name);
        }

        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) console.log('Cant delete files');
        })

        fs.unlink(filePath, (err) => {
            if (err) 
                console.log(err);
            console.log(`${filePath} is deleted !`);
        });
        
        await conn.beginTransaction();
        
        const result = await conn.query(query);
        let rows = result[0];

        if(rows.affectedRows == 0)
            throw {name: "deletedRowsNotExistException", message: "Deleted rows not Exist Exception"};

        await conn.commit();
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (e) {
        console.log(e);
        await conn.rollback();
        res.writeHead(404, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    } finally {
        conn.release();
    }

});

module.exports = router;

/* Post example
//const queryString = require('querystring');
router.post('/', (req,res) => {
    let json = ''
    
    req.on('data', data => {
        json = json + data;
        
    });
    
    req.on('end', () => {

        let parsedQuery = queryString.parse(json);
        console.log();

        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(parsedQuery.value1);
    });

});

*/

