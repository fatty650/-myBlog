const express = require('express')
const router = express.Router()
const {db,genid}  = require('../db/DbUtils')

// async -- 允许异步执行
router.get("/test",async (req,res)=>{
    db.all("select * from 'admin'",[],(err,rows)=>{
        console.log(rows);
    })
    // 写法1
    // db.async.all("select * from 'admin'",[])
    // .then((res)=>{
    //     console.log(res);
    // })
    // 写法2 更简单
    let out = await db.async.all("select * from 'admin'",[])

    res.send({
        id : genid.NextId(),
        out
    })
})

module.exports = router