
const db_config = {
    host : '',
    user : '',
    password : '',
    port : '',
    database : ''
    };

const cors_option = {

};

const server_url = {
    ip : "",
    port :
};

module.exports = {
    db () {  return db_config },
    cors () { return cors_option },
    port () { return port }
};