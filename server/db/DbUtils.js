const sqlite3 = require("sqlite3").verbose()
const { rejects } = require("assert")
const path = require("path")
const GenId = require("../utils/SnowFlake")

var db = new sqlite3.Database(path.join(__dirname, "blog.sqlite3"))
// WorderId 机器码，部署多个服务器时区分，并生成不同id
const genid = new GenId({ WorkerId: 1 })

// 添加 async 属性 -- 对象
db.async = {}
// 给 async 添加 all 方法
db.async.all = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.all(sql,params,(err,rows)=>{
            resolve({err,rows})
        })
    })
}

// run 用于修改和添加
db.async.run = (sql, params) => {
    return new Promise((resolve, reject) => {
        db.run(sql,params,(err,rows)=>{
            resolve({err,rows})
        })
    })
}

module.exports = { db, genid }