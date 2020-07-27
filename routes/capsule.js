const express = require('express');
const fs = require('fs');
const mime = require('mime');
const multer = require('multer');
const path = require('path');
const config = require('../config/config')
const mysql = require('mysql2/promise');

const ip = { // 서버 공인아이피
    address () { return config.url().newIp }
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
    /*
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }*/

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
    const query = `select   capsule.capsule_id, \
                            capsule.nick_name, \
                            title, \
                            likes, \
                            views, \
                            text, \
                            date_created, \
                            date_opened, \
                            status_temp, \
                            location, \
                            U_ST_DISTANCE_SPHERE(POINT(${lng}, ${lat}), location) as Dist,
                            expire, \
                            status_lock, \
                            key_count, \
                            used_key_count, \
                            scu.nick_name as member
                        from capsule \
                        LEFT JOIN lockedCapsule lc \
                        ON capsule.capsule_id = lc.capsule_id \
                        LEFT JOIN sharedCapsuleUser as scu \
                        ON capsule.capsule_id = scu.capsule_id \
                        where U_ST_DISTANCE_SPHERE(POINT(${lng}, ${lat}), location) <= 0.01 \
                        order by Dist;`
    
    let conn;
    try {

        conn = await pool.getConnection();

        if (req.query.lng == undefined || req.query.lat == undefined)
            throw " Get-Query-Exception : need lng, lat ";

        const result = await conn.query(query);
        let rows = result[0];
        let capsules = [];
        let members = [];
        let { capsule_id, user_id, nick_name, title, text, likes, views, date_created, date_opened,
            status_temp, location, dist, expire, status_lock, key_count, used_key_count} = rows[0];
        if (status_lock == null){
            status_lock = 0;
            key_count = 0;
            used_key_count = 0;
        }
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
            location,
            dist,
            expire, 
            status_lock, 
            key_count, 
            used_key_count,
            members:null
        });
        let index = 0;
        rows.forEach( (row)=>{
            //console.log(row)
            if (row.status_lock == null){
                row.status_lock = 0;
                row.key_count = 0;
                row.used_key_count = 0;
            }

            if (capsules[capsules.length - 1].capsule_id == row.capsule_id){
                if (row.member != null)
                    members.push(row.member);
                if (index + 1 == rows.length)
                    capsules[capsules.length - 1].members = members
            } else {
                console.log(capsules[capsules.length - 1].capsule_id, row.capsule_id)
                capsules[capsules.length - 1].members = members
                members = [];
                let { capsule_id, user_id, nick_name, title, text, likes, views, date_created, date_opened,
                    status_temp, location, dist, expire, status_lock, key_count, used_key_count} = row;
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
                    location,
                    dist,
                    expire, 
                    status_lock, 
                    key_count, 
                    used_key_count,
                    members:null
                });
                if (row.member != null)
                    members.push(row.member);
                if (index + 1 == rows.length)
                    capsules[capsules.length - 1].members = members
            }
            index++;
        });
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(capsules));
        
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
    /*
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }*/
    
    const nickName = req.params.nickName;
    let conn;
    const query = `select cap.capsule_id, \
                            user_id, \
                            cap.nick_name, \
                            title, \
                            text, \
                            likes, \
                            views, \
                            date_created, \
                            date_opened, \
                            status_temp, \
                            y(location) as lat, x(location) as lng, \
                            content_id, \
                            url, \
                            lc.expire, \
                            lc.status_lock, \
                            lc.key_count, \
                            lc.used_key_count,
                            scu.nick_name as member \
                        from capsule as cap \
                        LEFT JOIN content as ct \
                        ON cap.capsule_id = ct.capsule_id \
                        LEFT JOIN lockedCapsule as lc \
                        ON cap.capsule_id = lc.capsule_id \
                        LEFT JOIN sharedCapsuleUser as scu \
                        ON cap.capsule_id = scu.capsule_id \
                        group by cap.capsule_id, ct.content_id, scu.id \
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
            let i = 0;          // capsule_count
            let c_index = 0;    // content_count
            let m_flag = 1;
            let content = [];
            let members = [];
            let capsules = [];
            let { capsule_id, user_id, nick_name, title, text, likes, views, date_created, date_opened, status_temp, lat, lng, expire, status_lock, key_count, used_key_count} = rows[0];

            if (status_lock == null){
                status_lock = 0;
                key_count = 0;
                used_key_count = 0;
            }

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
                expire, 
                status_lock, 
                key_count, 
                used_key_count,
                content:null,
                members:null
            });

            rows.forEach( item => {
                if (item.url != undefined && ip.address() != config.url().ip) {
                    if (ip.address() != config.url().ip) {
                        item.url = item.url.replace(config.url().ip, ip.address());
                    }
                }

                if (item.status_lock == null) {
                    item.status_lock = 0;
                    item.key_count = 0;
                    item.used_key_count = 0;
                }

                if (item != undefined) {
                    if (item.capsule_id == capsules[index].capsule_id) {
                        if (c_index == 0) {
                            if (item.content_id != null ){
                                content.push({
                                    content_id: item.content_id,
                                    url: item.url
                                });
                                c_index++;
                            }
                        }

                        if (c_index > 0) {
                            if (content[c_index - 1].content_id != item.content_id && item.content_id != null) {
                                content.push({
                                    content_id: item.content_id,
                                    url: item.url
                                });
                                m_flag = 0;
                                c_index++;
                            }
                        }

                        if (m_flag == 1 && item.member != null) {
                            members.push(item.member);
                        }

                        if (rows.length - 1  == i) {
                            capsules[index].content = content;
                            capsules[index].members = members;
                            c_index = 0;
                        }

                    } else if (item.capsule_id != capsules[index].capsule_id) {
                        capsules[index].content = content;
                        capsules[index].members = members;
                        c_index = 0;
                        m_flag = 1;
                        index++;
                        content = [];
                        members = [];
                        
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
                            expire: item.expire, 
                            status_lock: item.status_lock, 
                            key_count: item.key_count, 
                            used_key_count: item.used_key_count,
                            content:null,
                            members:null
                        }

                        if (item.content_id != null) {
                            content.push({
                                content_id: item.content_id,
                                url: item.url
                            })
                            c_index++;
                        }
                        if (item.member != null) {
                            members.push(item.member);
                        }
    
                        if (rows.length - 1  == i) {
                            capsules[index].content = content;
                            capsules[index].members = members;
                            c_index = 0;
                        }
                    }
                }
                i = i + 1;
            });
            let j;
            for (j = capsules.length - 1; j >= 0; j-- ) {
                if (capsules[j].nick_name != nickName && !capsules[j].members.includes(nickName)){
                    capsules.splice(j, 1);
                }
            }
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

    const capsule_id = req.params.capsuleId;
    
    const query = `select cap.capsule_id, \
                            user_id, \
                            cap.nick_name, \
                            title, \
                            text, \
                            likes, \
                            views, \
                            date_created, \
                            date_opened, \
                            status_temp, \
                            y(location) as lat, x(location) as lng, \
                            content_id, \
                            url, \
                            lc.expire, \
                            lc.status_lock, \
                            lc.key_count, \
                            lc.used_key_count,
                            scu.nick_name as member \
                        from capsule as cap \
                        LEFT JOIN content as ct \
                        ON cap.capsule_id = ct.capsule_id \
                        LEFT JOIN lockedCapsule as lc \
                        ON cap.capsule_id = lc.capsule_id \
                        LEFT JOIN sharedCapsuleUser as scu \
                        ON cap.capsule_id = scu.capsule_id \
                        where cap.capsule_id = ${capsule_id} \
                        group by cap.capsule_id, ct.content_id, scu.id \
                        ORDER BY capsule_id DESC;`;

    let conn;
    try {

        conn = await pool.getConnection();

        if (capsule_id == undefined)
            throw "Get-URL-Capsule Exception - need capsuleId"

        
        let result = await conn.query(query);
        let rows = result[0];
        let capsules = [];
        if (rows.length == 0)
            throw "Exception : Cant Find Capsule with capsule_id";

        if (rows.length != 0) {    

            rows.forEach( item => {
                if ( item.url != undefined && ip.address() != config.url().ip) {
                    if (ip.address() != config.url().ip) {
                        item.url = item.url.replace(config.url().ip, ip.address());
                    }
                }
            });

            let index = 0;
            let i = 0;          // capsule_count
            let c_index = 0;    // content_count
            let m_flag = 1;
            let content = [];
            let members = [];

            let { capsule_id, user_id, nick_name, title, text, likes, views, date_created, date_opened, status_temp, lat, lng, expire, status_lock, key_count, used_key_count} = rows[0];

            if (status_lock == null){
                status_lock = 0;
                key_count = 0;
                used_key_count = 0;
            }
                
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
                expire, 
                status_lock, 
                key_count, 
                used_key_count,
                content:null,
                members:null
            });

            rows.forEach( item => {
                
                if (item.url != undefined && ip.address() != config.url().ip) {
                    if (ip.address() != config.url().ip) {
                        item.url = item.url.replace(config.url().ip, ip.address());
                    }
                }
                if (item.status_lock == null) {
                    item.status_lock = 0;
                    item.key_count = 0;
                    item.used_key_count = 0;
                }
                if (item != undefined) {
                    if (item.capsule_id == capsules[index].capsule_id) {
                        if (c_index == 0) {
                            if (item.content_id != null ){
                                content.push({
                                    content_id: item.content_id,
                                    url: item.url
                                });
                                c_index++;
                            }
                        }

                        if (c_index > 0) {
                            if (content[c_index - 1].content_id != item.content_id && item.content_id != null) {
                                content.push({
                                    content_id: item.content_id,
                                    url: item.url
                                })
                                m_flag = 0;
                                c_index++;
                            }
                        }

                        if (m_flag == 1 && item.member != null) {
                            members.push(item.member);
                        }

                        if (rows.length - 1  == i) {
                            capsules[index].content = content;
                            capsules[index].members = members;
                            c_index = 0;
                        }

                    } else if (item.capsule_id != capsules[index].capsule_id) {
                        capsules[index].content = content;
                        capsules[index].members = members;
                        m_flag = 1;
                        c_index = 0;
                        index = index + 1;
                        content = [];
                        members = [];
                        
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
                            expire: item.expire, 
                            status_lock: item.status_lock, 
                            key_count: item.key_count, 
                            used_key_count: item.used_key_count,
                            content:null,
                            members:null
                        }

                        if (item.content_id != null) {
                            content.push({
                                content_id: item.content_id,
                                url: item.url
                            })
                            c_index++;
                        }
                        if (item.member != null) {
                            members.push(item.member);
                        }
    
                        if (rows.length - 1  == i) {
                            capsules[index].content = content;
                            capsules[index].members = members;
                            c_index = 0;
                        }
                    }
                }
                i = i + 1;
            });
        } 
        
        //console.log(capsules);
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(capsules[0]));

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

router.get('/f4f/:nickName', async (req, res)=>{
    
    console.log("request Ip ( Get Capsules with nickName ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');
    /*
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }*/
    
    const nick_name = req.params.nickName;
    let conn;

    const f4fListQuery = `select \
                            nick_name, \
                            dest_nick_name \
                        from follow;`;

    const query = `select cap.capsule_id, \
                            user_id, \
                            cap.nick_name, \
                            title, \
                            text, \
                            likes, \
                            views, \
                            date_created, \
                            date_opened, \
                            status_temp, \
                            y(location) as lat, x(location) as lng, \
                            content_id, \
                            url, \
                            lc.expire, \
                            lc.status_lock, \
                            lc.key_count, \
                            lc.used_key_count,
                            scu.nick_name as member \
                        from capsule as cap \
                        LEFT JOIN content as ct \
                        ON cap.capsule_id = ct.capsule_id \
                        LEFT JOIN lockedCapsule as lc \
                        ON cap.capsule_id = lc.capsule_id \
                        LEFT JOIN sharedCapsuleUser as scu \
                        ON cap.capsule_id = scu.capsule_id \
                        group by cap.capsule_id, ct.content_id, scu.id \
                        ORDER BY capsule_id DESC;`;
    try {

        conn = await pool.getConnection();

        const resultF4fListQuery = await conn.query(f4fListQuery);
        const rowF4FListQuery = resultF4fListQuery[0];
        
        let followList = [];
        let followerList = [];
        rowF4FListQuery.forEach(row => {
            if (row.nick_name == nick_name && !(followList.includes(row.dest_nick_name)))
                followList.push(row.dest_nick_name);
            if (row.nick_name != nick_name && !(followerList.includes(row.nick_name))){
                followerList.push(row.nick_name);
            }
        });
        let f4f = [];
        followerList.forEach( followerRow =>{
            if (followList.includes(followerRow))
                f4f.push(followerRow);
        })

        const result = await conn.query(query);

        let rows = result[0];
        if (rows.length == 0) {

            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify([]));

        } else {

            let index = 0;
            let i = 0;          // capsule_count
            let c_index = 0;    // content_count
            let m_flag = 1;
            let content = [];
            let members = [];
            let capsules = [];
            
            rows.forEach( item => {

                if (f4f.includes(item.nick_name)){
                    
                    if (item.url != undefined && ip.address() != config.url().ip) {
                        if (ip.address() != config.url().ip) {
                            item.url = item.url.replace(config.url().ip, ip.address());
                        }
                    }
    
                    if (item.status_lock == null) {
                        item.status_lock = 0;
                        item.key_count = 0;
                        item.used_key_count = 0;
                    }

                    if (item != undefined) {
                        
                        if (capsules.length > 0 && item.capsule_id == capsules[index].capsule_id) {
                            if (c_index == 0) {
                                if (item.content_id != null ){
                                    content.push({
                                        content_id: item.content_id,
                                        url: item.url
                                    });
                                    c_index++;
                                }
                            }
    
                            if (c_index > 0) {
                                if (content[c_index - 1].content_id != item.content_id && item.content_id != null) {
                                    content.push({
                                        content_id: item.content_id,
                                        url: item.url
                                    });
                                    m_flag = 0;
                                    c_index++;
                                }
                            }
    
                            if (m_flag == 1 && item.member != null) {
                                members.push(item.member);
                            }
    
                            if (rows.length - 1  == i) {
                                capsules[index].content = content;
                                capsules[index].members = members;
                                c_index = 0;
                            }
    
                        } else if (capsules.length == 0 || item.capsule_id != capsules[index].capsule_id) {
                            if (capsules.length > 0){
                                capsules[index].content = content;
                                capsules[index].members = members;
                                c_index = 0;
                                m_flag = 1;
                                index++;
                                content = [];
                                members = [];
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
                                    expire: item.expire, 
                                    status_lock: item.status_lock, 
                                    key_count: item.key_count, 
                                    used_key_count: item.used_key_count,
                                    content:null,
                                    members:null
                                }
        
                                if (item.content_id != null) {
                                    content.push({
                                        content_id: item.content_id,
                                        url: item.url
                                    })
                                    c_index++;
                                }
                                if (item.member != null) {
                                    members.push(item.member);
                                }
            
                                if (rows.length - 1  == i) {
                                    capsules[index].content = content;
                                    capsules[index].members = members;
                                    c_index = 0;
                                }
                            } else if (capsules.length == 0) {
                                console.log(i, item.capsule_id);
                                let { capsule_id, user_id, nick_name, title, text, likes, views, date_created, date_opened,
                                    status_temp, lat, lng, expire, status_lock, key_count, used_key_count} = item;
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
                                    expire, 
                                    status_lock, 
                                    key_count, 
                                    used_key_count,
                                    content:[],
                                    members:[]
                                });
                            }
                        }
                    }
                }
                i = i + 1;
            });
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

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    let conn;
    
    const filesInfo = req.files
    const capsule_id = req.body.capsule_id;
    let {title, text} = req.body;
    
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
                                text = ${textQuery}, \
                                status_temp = 0 \
                                where capsule_id = ${capsule_id} AND \
                                status_temp = 1;`;

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

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    let conn;
    console.log(req.body);
    const {capsule_id} = req.body;
    const status_temp = 0;
    let {text, title} = req.body;
    
    
    // mysql ' " exception control
    title = title.replace("'","\\'").replace('"','\\"');

    let textQuery = null;
    if (text != undefined){
        text = text.replace("'","\\'").replace('"','\\"');
        textQuery = '\'' + text + '\'';
    }
        

    try {

        conn = await pool.getConnection();


        if ( title == undefined || capsule_id == undefined ) {
            throw {name: 'undefinedBodyException', message: "Put Capsule - Capsule_info not exist"};
        }

        

        const updateQuery = `update capsule SET \
                                title = '${title}', \
                                status_temp = ${status_temp}, \
                                text = ${textQuery}, \
                                status_temp = 0 \
                                where status_temp = 1 AND \
                                capsule_id = ${capsule_id};`;
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

// LockedCapsule 저장
router.put('/lock/images', upload.array("file"), async (req, res) => {


    console.log("request Ip ( Put Capsule with images ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

    let conn;
    
    const filesInfo = req.files
    const capsule_id = req.body.capsule_id;
    let {title, text} = req.body;
    
    // mysql ' " exception control
    title = title.replace("'","\\'").replace('"','\\"');

    let textQuery = null;
    if (text != undefined){
        text = text.replace("'","\\'").replace('"','\\"');
        textQuery = '\'' + text + '\'';
    }
    

    try {

        conn = await pool.getConnection();

        if (capsule_id == undefined || title == undefined || filesInfo == undefined ) {
            throw {name: 'undefinedBodyException', message: "Put Put LockedCapsule - Capsule_info not exist"};
        }

        const status_temp = 0;

        let insertQuerys = "";

        const updateQuery = `update capsule SET \
                                title = '${title}', \
                                status_temp = ${status_temp}, \
                                text = ${textQuery}, \
                                status_temp = 0 \
                                where capsule_id = ${capsule_id} AND \
                                status_temp = 1;`;

        const lockedCapsuleQuery = `insert into lockedCapsule (capsule_id, expire, key_count) values (${capsule_id}, '${expire}', ${members.length});`;

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
        const updResult = await conn.query(updateQuery + lockedCapsuleQuery);
        const insResult = await conn.query(insertQuerys);

        if (updResult[0].affectedRows == 0)
            throw {name: 'putCapsuleNotUpdateException', message: "Put LockedCapsule-Not-Update Error"};
        
        if (updResult[1].affectedRows == 0)
            throw {name: 'putCapsuleNotUpdateException', message: "Put LockedCapsule(lockedCapsule)-Not-Insert Error"};

        insResult.forEach( result => {
            if(result == undefined)
                return;
            if (result.affectedRows == 0)
                throw {name: 'putCapsuleNotInsertException', message: "Put Put LockedCapsule(Content)-Not-Insert Error"};
        })

        let sharedCapsuleUserQuery = `insert into sharedCapsuleUser (nick_name, capsule_id) values (?, ${capsule_id});`
        let sharedCapsuleUserResult;

        if (members.length > 0){
            members.forEach(async (member) => {
                sharedCapsuleUserResult = await conn.query(sharedCapsuleUserQuery, member);
                console.log(sharedCapsuleUserResult);
                if (sharedCapsuleUserResult[0].affectedRows == 0)
                    throw {name: 'putCapsuleNotUpdateException', message: "Put LockedCapsule-SharedMember-Not-Insert Error"};
            })
        }
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

router.put('/lock', async (req, res) => {

    console.log("request Ip ( Put Capsule ) :",req.connection.remoteAddress.replace('::ffff:', ''));
    const reqIp = req.connection.remoteAddress.replace('::ffff:', '');
    /*
    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }
    */
    let conn;
    console.log(req.body);
    const {capsule_id, members, expire} = req.body;
    let {text, title} = req.body;

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

        if ( capsule_id == undefined || title == undefined || expire == undefined || members == undefined) {
            throw {name: 'undefinedBodyException', message: "Put LockedCapsule - Capsule_info not exist"};
        }


        const updateQuery = `update capsule SET \
                                title = '${title}', \
                                status_temp = ${status_temp}, \
                                text = ${textQuery}, \
                                status_temp = 0 \
                                where capsule_id = ${capsule_id} AND \
                                status_temp = 1;`;

        const lockedCapsuleQuery = `insert into lockedCapsule (capsule_id, expire, key_count) values (${capsule_id}, '${expire}', ${members.length});`;
        // DB Transaction Start
        await conn.beginTransaction();
        const Result = await conn.query(updateQuery + lockedCapsuleQuery);

        if (Result[0].affectedRows == 0)
            throw {name: 'putCapsuleNotUpdateException', message: "Put LockedCapsule-Not-Update Error"};
        if (Result[1].affectedRows == 0)
            throw {name: 'putCapsuleNotUpdateException', message: "Put LockedCapsule-Not-Insert Error"};
        
        let sharedCapsuleUserQuery = `insert into sharedCapsuleUser (nick_name, capsule_id) values (?, ${capsule_id});`
        let sharedCapsuleUserResult;
        if (members.length > 0){
            members.forEach(async (member) => {
                sharedCapsuleUserResult = await conn.query(sharedCapsuleUserQuery, member);
                console.log(sharedCapsuleUserResult);
                if (sharedCapsuleUserResult[0].affectedRows == 0)
                    throw {name: 'putCapsuleNotUpdateException', message: "Put LockedCapsule-SharedMember-Not-Insert Error"};
            })
            
        }
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

    if(req.session.nick_name == undefined){
        console.log("   Session nick is undefined ");
        res.writeHead(401, {'Content-Type':'application/json'});
        res.end();
        return;
    }

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