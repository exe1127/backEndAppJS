
const deb=new (require('rest-mssql-nodejs'))({
    user: 'Axoft',
    password: 'Axoft',
    server: '192.168.1.25\\AXOFT',
    database: 'promociones',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
})


module.exports =deb;