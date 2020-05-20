const express = require('express');
const fs = require('fs');
const mime = require('mime');
const router = express.Router();

// Get images

router.get('/:imgId', (req,res,next) => {
    const imgId = req.params.imgId;
    console.log(req.params.imgId);

    const imgPath = './public/images/'+imgId;
    const imgMime = mime.getType(imgPath);
    console.log('imgPath : '+imgPath);
    console.log('imgMime : '+imgMime);
    fs.readFile(imgPath, (error, data) => {
        if (error){
            console.log('Page not found 404 : ' + error);
        }else{
            res.writeHead(200, {'Content-Type':imgMime});
            res.end(data);
        }            
        
    });
    
});

module.exports = router;