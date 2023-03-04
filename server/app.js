// 引入并实例化模块
const express = require('express')
const multer = require('multer')
const app = express()
const path = require('path')
const { db, genid } = require("./db/DbUtils")
// 定义端口
const port = 8080


// 跨域请求
app.use((req,res,next)=>{
    // 设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*")
    // 允许的 header 类型
    res.header("Access-Control-Allow-Headers","*")
    // 跨域允许的请求方式
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS")
    if (req.method == "OPTIONS") res.sendStatus(200) //让options 尝试请求快速结束
    else next()
})

// 数据解析
app.use(express.json())  //中间件须在路由之前，所以写前面

// 指定上传路径
const update = multer({
    dest: './public/upload/temp'
})
app.use(update.any())

// 指定静态资源路径
app.use(express.static(path.join(__dirname,"public")))

// 验证token中间件
const ADMIN_TOKEN_PATH = "/_token" //token校验路径（标记用）
app.all("*", async (req,res,next)=>{
    if (req.path.indexOf(ADMIN_TOKEN_PATH)>-1){ //接口路径上有“/_token” 则进行token验证
        let {token} = req.headers
        let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
        let adminRes = await db.async.all(admin_token_sql,[token])
        if(adminRes.err != null || adminRes.rows.length == 0){
            res.send({
                code: 403,
                msg: "用户权限错误，请先登录"
            })
        }else{
            next()
        }
    }else{
        next()
    }
})

// 注册路由
app.use("/test",require('./routers/TestRouter'))
app.use("/admin",require('./routers/AdminRouter'))
app.use("/category",require('./routers/CategoryRouter'))
app.use("/blog",require('./routers/BlogRouter'))
app.use("/upload",require('./routers/UploadRouter'))

app.get("/", (req,res) => {
    res.send("hello world")
})

app.listen(port, ()=>{
    console.log(`success : http://localhost:${port}/`);
})