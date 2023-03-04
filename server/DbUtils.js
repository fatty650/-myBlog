const sqlite3 = require("sqlite3").verbose()
const path = require('path')

const Genid = require('../utils/SnowFlake')


let db = new sqlite3.Database(path.join(__dirname,"blog_sqlite"))

const genid = new Genid({WorkerId:1}) //WorderId 机器码，表示当前工作机，以后部署多台服务器可以修改

module.exports = {db,genid}