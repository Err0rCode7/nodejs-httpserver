const express = require('express');
const mysql = require('mysql');
const config = require('../config/config.js');

const router = express.Router();

const connection = mysql.createConnection(config.db());
connection.connect( (err) => {
    if(err) {
        console.log('user router : ' + err);
        return;
    }
});

router.get('/', (req, res) => {

    const query = `select user_id, nick_name, first_name, last_name, date_created, date_updated from user`;
    connection.query(query, (err, rows, field) => {
            if(err){
                console.log('User Get_all_user Query '+ err);
                res.writeHead(404, {'Content-Type':'application/json'});
                res.end('{"success": false}'); //json object로 변경
            } else {
                //rows is array type containing json
                console.log(field);
                rows.unshift({"success":true});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(rows)); //json object로 변경
            }
            
    })
});

router.get('/:id', (req, res) => {

    const query = `select user_id, nick_name, first_name, last_name, date_created, date_updated from user where user_id = "${req.params.id}"`;
    connection.query(query, (err, rows) => {
            if(err){
                console.log('User Get_user Query '+ err);
                res.writeHead(404, {'Content-Type':'application/json'});
                res.end('{"success": false}'); 
            } else {
                //rows is array type containing json
                //rows[0]["password"] = null;
                const resJson = {}
                if(!rows[0])
                {
                    rows.unshift({"success":false});
                } else {
                    rows.unshift({"success":true});
                }

                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(rows)); //json object로 변경
            }
            
    })

});
//register
router.post('/', (req, res) => {
    
    console.log(req.body);
    const query = `insert into user (user_id, password, nick_name, first_name, last_name, date_created, date_updated) \
    values("${req.body.user_id}", password("${req.body.password}"), "${req.body.nick_name}", "${req.body.first_name}", "${req.body.last_name}", now(), now())`;
    
    
    connection.query(query, (err, rows) =>{
        if(err){
            console.log('User Post Query '+ err);

            res.writeHead(404, {'Content-Type':'application/json'});
            res.end('{"success": false}'); 

        } else {
            
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end('{"success": true}'); 

        }
    });
    
});

router.post('/auth', (req, res) =>{

    console.log(req.body);
    const query = `select user_id from user where user_id = "${req.body.user_id}" and password = password("${req.body.password}");`;   
    
    connection.query(query, (err, rows) =>{
        if(err){
            console.log('User Post Login Query '+ err);

            res.writeHead(404, {'Content-Type':'application/json'});
            res.end('{"success": errMsg}'); 

        } else {
            const resJson = {"success": true};
            if(!rows[0]) {
                resJson.success = false; 
            }

            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify(resJson)); 
        }
    });
});

router.put('/', (req, res) => {
    
    const query = `update user set password=password("${req.body.password}"), nick_name="${req.body.nick_name}", first_name="${req.body.first_name}", \
    last_name="${req.body.last_name}", date_updated=now() where user_id = "${req.body.user_id}"`;

    connection.query(query, (err, rows) =>{
        if(err){
            console.log('User Put Query '+ err);

            res.writeHead(404, {'Content-Type':'application/json'});
            res.end('{"success": false}'); 

        } else {
            
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end('{"success": true}'); 

        }
    });
});

router.delete('/:id', (req, res) =>{
    const query = `delete from user where user_id="${req.params.id}"`;

    connection.query(query, (err, rows) =>{
        if(err){
            console.log('User Delete Query '+ err);

            res.writeHead(404, {'Content-Type':'application/json'});
            res.end('{"success": false}'); 

        } else {
            
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end('{"success": true}'); 

        }
    });
});

module.exports = router;
