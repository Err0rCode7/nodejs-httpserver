// require 은 import와 비슷한 개념으로 객체, 변수 등을 가져온다.
//const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');

// Router
const imageRouter = require('./routes/image.js');
const videoRouter = require('./routes/video.js');

const app = express();

// cors : cross-origin http enable
const corsOptions = {
    origin: 'http://localhost:7070',
    credentials: true,
};
app.use(cors(corsOptions));

// bodyParser ( http - body)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


app.use('/images', imageRouter);
app.use('/videos', videoRouter);

/* 
// 라우터 get 방식 예시
app.get('/', (req,res,next) => {
   console.log("url : ./");
   res.json({url:'./', text:'It\'s first time'});
});
*/

/*
// 일반 nodejs 버전
// http server 생성 요청과, 응답을 기본 파라미터로 한다.
const server = http.createServer( (request, response) => {
    const { headers, method, _url:url } = request;

    response.writeHead(200, {'Content-Type':'text/html'});
    response.end('Hello node.js!!');
    
    // express router 사용안했을 때 routing 로직
    if ( _url === '/'){
        console.log("url : l");
    }
    else if ( _url === '/hi'){
        console.log("url : ", url);
    }
});

server.listen(8080, () => {
    console.log('server is running');
});
*/

app.listen(7070, () => {
    console.log('express server is running');
});
