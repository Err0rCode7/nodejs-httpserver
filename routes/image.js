const express = require('express');
const fs = require('fs');
const mime = require('mime');
//const queryString = require('querystring');
const multer = require('multer');
const path = require('path');
const config = require('../config/config')


const router = express.Router();

// ImageType ( Post )

/*
const imageType = {
    imageName: int, //data.now().extension
    capsuleId: int, // select key 
    imagePath: String, // image storage
    extension: String, // file extension
    size: int // file size
    imageNumber: int // number for order
}
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

// Get contentId

router.get('/capsule-id/:capsuleId', (req, res) => {
    console.log(req.params.capsuleId);
    
    const capsuleId = req.params.capsuleId;

    /* sql select contentId with capsule Id */
    

    /* sql select contentId with capsule Id */

    res.writeHead(200, { 'Content-Type' : 'application/json' });
    res.end('{"success": true}');

});


// Get contents

router.get('/:contentid', (req, res, next) => {

    try{
        const contentId = req.params.contentid;
        let contentPath = "";
        console.log((path.extname(contentId)));
        if ( isImg((path.extname(contentId)), result => {
            return result
        })) {
            contentPath = './public/images/'+contentId;    
        } else {
            contentPath = './public/videos/'+contentId;
        }
        const contentMime = mime.getType(contentPath);
        console.log('contentPath: '+ contentPath);
        console.log('contentMime: '+ contentMime);

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
        let count = 0;
        stream.on('data', (data) => {
            
            console.log('content data count= '+ (count = count+1));
            res.write(data);
        });
        
        stream.on('end', () => { 
            console.log('end streaming')
            res.end();
        })
        stream.on('error', (error) => {
            res.writeHead(500, {'Content-Type':'application/json'});
            res.end('{"success": false, "error": "internal error"}');
        });

    } catch(error) {
        console.log(error);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    }
});

// post content ( upload image-form data )
//      multer 는 헤더에 content-type:x-www-form-urlencoded 를 사용하지 않고 multipart/form-data를 사용한다.
router.post('/', upload.single("file"), (req, res) => {
    
    try{
        console.log(req.file);
        //console.log(req.body.capsule_id);

        const content_name = req.file.filename;
        const capsule_id = req.body.capsule_id;
        const uri = config.url().ip + ":" + config.url().port + "contents" + content_name;
        const extension = path.extname(req.file.originalname);
        const size = req.file.size;
        const id = req.body.id;
        const content = {
            id,
            content_name,
            capsule_id,
            uri,
            extension,
            size
        };
        console.log(content);
        
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": true}');

    } catch (error) {
        console.log(error);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end('{"success": false}');
    }

});

router.put('/', (req, res) =>{
    res.writeHead(404, {'Content-Type':'text/html'});
    res.end('404 Page Not Found');
});

router.delete('/:id', (req, res) =>{
    /* image delete query */
    // -> capsule-delete 에서 실행 
    /* image delete query */
    res.writeHead(404, {'Content-Type':'text/html'});
    res.end('404 Page Not Found');
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

