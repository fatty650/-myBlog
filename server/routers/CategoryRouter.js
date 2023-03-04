// 分类表增删查改
const express = require('express')
const router = express.Router()
const {db,genid}  = require('../db/DbUtils')

// 列表接口
router.get("/list",async (req,res)=>{
    const search_sql = "SELECT * FROM `category`"
    let {err,rows} = await db.async.all(search_sql,[])
    if (err == null) {
        res.send({
            code: 200,
            msg: 'search success',
            rows
        })
    }
    else{
        res.send({
            code: 500,
            msg: 'search failed'
        })
    }
})

// 添加
router.post("/_token/add", async (req,res)=>{
    let { name } = req.body
    const insert_sql = "INSERT INTO `category` (`id`,`name`) VALUES (?,?)"
    let {err,rows} = await db.async.run(insert_sql,[genid.NextId(),name])
    if (err == null) {
        res.send({
            code: 200,
            msg: 'add success',
            data: rows
        })
    }
    else{
        res.send({
            code: 500,
            msg: 'add failed'
        })
    }
})

// 修改 , post 也行
router.put("/_token/update", async (req,res)=>{
    let { id, name } = req.body
    const update_sql = "UPDATE `category` SET `name` = ? WHERE `id` = ? "
    let { err, rows } = await db.async.run(update_sql, [name, id])

    if (err == null) {
        res.send({
            code: 200,
            msg: "update success"
        })
    } else {
        res.send({
            code: 500,
            msg: "update failed"
        })
    }
})

// 删除 /category/delete?id=xxx
router.delete("/_token/delete", async (req,res)=>{
    let id = req.query.id  //直接获取路径上的id
    const delete_sql = "DELETE FROM `category` where `id` = ?"
    let {err,rows} = await db.async.run(delete_sql,id)
    if (err == null) {
        res.send({
            code: 200,
            msg: 'delete success',
        })
    }
    else{
        res.send({
            code: 500,
            msg: 'delete failed'
        })
    }
})


module.exports = router