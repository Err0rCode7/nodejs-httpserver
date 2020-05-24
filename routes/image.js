const express = require('express');
const fs = require('fs');
const mime = require('mime');
const queryString = require('querystring');
const multer = require('multer');
const path = require('path');

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
*/

// file upload object
const storage = multer.diskStorage({
    // Path 콜백
    destination : (req, file, callback) => {
        callback(null, 'public/images/');      
    },

    limits: {
        fileSize: 5 * 1024 * 1024 // limit: 5MB
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

// Get imageId

router.get('/capsule-id/:capsuleId', (req, res) => {
    console.log(req.params.capsuleId);
    
    const capsuleId = req.params.capsuleId;

    /* sql select imageId with capsule Id */
    

    /* sql select imageId with capsule Id */

    res.writeHead(200, { 'Content-Type' : 'application/json' });
    res.end('{"success": true}');

});


// Get image

router.get('/:imageid', (req, res, next) => {
    const imgId = req.params.imageid;
    console.log(req.params.imageid);

    const imgPath = './public/images/'+imgId;
    const imgMime = mime.getType(imgPath);
    console.log('imgPath: '+imgPath);
    console.log('imgMime: '+imgMime);
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
    const stream = fs.createReadStream(imgPath);
    let count = 0;
    stream.on('data', (data) => {
        
        console.log('image data count= '+ (count = count+1));
        res.write(data);
    });
    
    stream.on('end', () => { 
        console.log('end streaming');
        res.end();
    })
    stream.on('error', (error) => {
        console.log(error);
        res.end('500 Internal Server '+error);
    });
});

// post image ( upload image-form data)

router.post('/', upload.single("imgFile"), (req, res) => {

    console.log(req.imgFile);
    console.log(req.body.capsuleId);
    const imageName = req.imgFile.filename;
    const capsuleId = req.body.capsuleId;
    const imagePath = req.imgFile.path;
    const extension = path.extname(req.imgFile.originalname);
    const size = req.imgFile.size;
    const imageNumber = req.body.imageNumber;
    console.log({
        imageName,
        capsuleId,
        imagePath,
        extension,
        size,
        imageNumber
    });
    
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end({"success": true});

});
router.put('/', (req, res) =>{
    res.writeHead(404, {'Content-Type':'text/html'});
    res.end('404 Page Not Found');
});
router.delete('/:id', (req, res) =>{


    /* image delete query */

    /* image delete query */
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end('{"success": true}');
});

/* Post example

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

module.exports = router;