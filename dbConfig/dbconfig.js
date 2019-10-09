const mariadb = require('mariadb');
var getDbConn =  function () {
    return new Promise((resolve, reject)=>{
        mariadb.createConnection({
            host : '192.168.16.119',
            port : 3306,
            user : 'root',
            password : 'Ojas1525',
            database : 'payvoo2'
        }).then(conn=>{
            resolve(conn);
        }).catch(err=>{
            reject({ msg : "Error occured while connecting to DB " + err});
        })
    })
} 

export {getDbConn};