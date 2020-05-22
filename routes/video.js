const express = require('express');
const fs = require('fs');
const mime = require('mime');
const router = express.Router();

router.get('/:videoId', (req,res,next) => {

    // Add Access-Control-Allow-Origin response header 
    res.header("Access-Control-Allow-Origin", "*");

    console.log(req.params);
    const videoId = req.params.videoId;
    console.log(videoId);

    const videoPath = './public/videos/'+videoId;
    videoSrc = videoPath;
    const videoMime = mime.getType(videoPath);

    console.log(videoPath);
    console.log(videoMime);

    // send video
    const stream = fs.createReadStream(videoPath);
    let count = 0;
    stream.on('data', (data) => {
        
        console.log('video data count= '+ (count = count+1));
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

    // json 으로 경로 보내기 예시
    /*
    response = {
        path : videoPath
    };
    res.json(response);
    */
    
    // html 보내기 예시
    /*
    fs.readFile('./video.html', 'utf-8', (error, data) => {
        if(error){
            res.writeHead(500, {'Content-Type':'text/html'});
            res.end('500 Internal Server '+error);
        }else{
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        }
    });
    */
    

});


module.exports = router;
