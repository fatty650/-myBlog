// blog 表增删查改
const express = require('express')
const router = express.Router()
const {db,genid}  = require('../db/DbUtils')

// 查询接口（单）
router.get("/detail",async (req,res)=>{
    let { id } = req.query
    let detail_sql = "SELECT * FROM `blog` WHERE id = ?"
    let { err,rows } = await db.async.all(detail_sql,[id])
    if (err == null) {
        res.send({
            code: 200,
            msg: 'get success',
            rows
        })
    }
    else{
        res.send({
            code: 500,
            msg: 'get failed'
        })
    }
})

// 查询接口（多）
router.get("/search",async (req,res)=>{
    /**
     * key 关键字
     * categoryId 分类id
     * 
     * 分页：
     * 页码/页数
     * 分页大小
     * 
     */
    let {key,categoryId,page,pageSize} = req.query
    // 赋值
    page = page == null ? 1 : page
    pageSize = pageSize == null ? 10 : pageSize
    categoryId = categoryId == null ? 0 : categoryId
    key = key == null ? "" : key
    // 查询字段
    let params = [], whereSqls = []
    if (categoryId != 0) {
        whereSqls.push(" `category_id` = ? ")
        params.push(categoryId)
    }
    if (key != "") {
        // 模糊查询 LIKE , 用括号括起来防止拼接后出现歧义
        whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) ")
        params.push(`%${key}%`)
        params.push("%" + key + "%")
    }
    // 拼装查询语句
    let whereSqlStr = ""
    if (whereSqls.length > 0) {
        whereSqlStr = " WHERE " + whereSqls.join(" AND ")
    }

    // 查询分页数据
    let searchSql = " SELECT `id`,`category_id`,`create_time`,`title`,substr(`content`,0,50) AS `content` FROM `blog` " + whereSqlStr + " ORDER BY `create_time` DESC LIMIT ?,? " // 根据创建时间排序，limit作为分页使用
    // 查询结果的数据，如：第0开始取10个  第10个开始取10   第10个开始取5
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

     //查询数据总数，取别名方便，原名是 count(*) 不能直接用
     let searchCountSql = " SELECT count(*) AS count FROM `blog` " + whereSqlStr;
     let searchCountParams = params

    //分页数据和总数的返回结果
    let searchResult = await db.async.all(searchSql, searchSqlParams)
    let countResult = await db.async.all(searchCountSql, searchCountParams)


    if (searchResult.err == null && countResult.err == null) {
        res.send({
            code: 200,
            msg: 'search success',
            data: {
                key,
                categoryId,
                page,
                pageSize,
                rows: searchResult.rows,
                count: countResult.rows[0].count
                //第二种写法 count: countResult.rows[0]["count(*)"]
            }
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
    let { title, categoryId, content } = req.body
    let id = genid.NextId()
    let create_time = new Date().getTime()
    const insert_sql = "INSERT INTO `blog` (`id`,`title`,`category_id`,`content`,`create_time`) VALUES (?,?,?,?,?)"
    // 用数组存储传入数据库的参数
    let params = [id, title, categoryId, content, create_time]
    let {err,rows} = await db.async.run(insert_sql,params)

    if (err == null) {
        res.send({
            code: 200,
            msg: 'add success'
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
    let { id, title, categoryId, content } = req.body
    const update_sql = "UPDATE `blog` SET `title` = ? , `content` = ? , `category_id` = ? WHERE `id` = ? "
    let params = [title,content,categoryId,id]

    let { err, rows } = await db.async.run(update_sql, params)

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
    const delete_sql = "DELETE FROM `blog` where `id` = ?"
    let {err,rows} = await db.async.run(delete_sql,[id])
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