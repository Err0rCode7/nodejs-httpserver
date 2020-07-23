// require 은 import와 비슷한 개념으로 객체, 변수 등을 가져온다.
//const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const mysql = require('mysql2/promise');
const config = require('./config/config.js');
const session = require('express-session');
const mysqlStore = require('express-mysql-session');

const options = {
    host: config.db().host,
    port: config.db().port,
    user: config.db().user,
    password: config.db().password,
    database: config.db().database,
    clearExpired: true,
    checkExpirationInterval: 60 * 15 * 1000,
    expiration: 60 * 60 * 4 * 1000
}


// Router
const contentRouter = require('./routes/content.js');
const userRouter = require('./routes/user.js');
const capsuleRouter = require('./routes/capsule.js');
const followRouter = require('./routes/follow.js');
const likeRouter = require('./routes/like.js');
const commentRouter = require('./routes/comment.js');
const sessionRouter = require('./routes/session.js');
//const videoRouter = require('./routes/video.js');


// express
const app = express();

app.use(express.urlencoded({ extended: true}));

// session
app.use(session({
    secret              : 'jaskl;djfie@#$jc2@#SD#@$(%4',
    resave              : 'false',
    saveUninitialized   :  true,
    store               : new mysqlStore(options)
}));

// cors : cross-origin http enable
app.use(cors(config.cors()));

// bodyParser ( http - body)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


app.use('/contents', contentRouter);
app.use('/users', userRouter);
app.use('/capsules', capsuleRouter);
app.use('/follow', followRouter);
app.use('/like', likeRouter);
app.use('/comment', commentRouter);
app.use('/session', sessionRouter);
//app.use('/videos', videoRouter);


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

app.listen(config.url().port, () => {
    console.log('express server is running');
});
