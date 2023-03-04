<template>
    <n-tabs v-model:value="tabValue" justify-content="start"  type="line">
        <n-tab-pane name="list" tab="文章列表">
            <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px">
                <n-card :title="blog.title">
                    <n-ellipsis style="max-width: 500px">
                        {{ blog.content }}
                    </n-ellipsis>
                    <template #footer>
                        <n-space align="center">
                            <div>发布时间：{{ blog.create_time }}</div>
                            <n-button @click="toUpdate(blog)">修改</n-button>
                            <n-button @click="toDelete(blog)">删除</n-button>
                        </n-space>
                    </template>
                </n-card>
            </div>
            <n-space vertical style="width:100%">
                <n-pagination 
                v-model:page=pageInfo.page
                :page-count=pageInfo.pageCount
                show-quick-jumper
                v-model:page-size=pageInfo.pageSize
                show-size-picker
                @update:page="loadBlogs"
                :page-sizes="[5,10,15,20]"
                @update:page-size="loadBlogs"
                >
                    <template #goto>跳转至</template>
                </n-pagination>
            </n-space>
        </n-tab-pane>
        <n-tab-pane name="add" tab="添加文章">
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="addArticle.title" placeholder="请输入文章标题"/>
                </n-form-item>
                 <n-form-item label="分类">
                    <n-select v-model:value="addArticle.categoryId" :options="categortyOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="addArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="add">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
        <n-tab-pane name="update" tab="修改文章" disabled>
            <n-form>
                <n-form-item label="标题">
                    <n-input v-model:value="updateArticle.title" placeholder="请输入标题" />
                </n-form-item>
                <n-form-item label="分类">
                    <n-select v-model:value="updateArticle.categoryId" :options="categortyOptions" />
                </n-form-item>
                <n-form-item label="内容">
                    <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
                </n-form-item>
                <n-form-item label="">
                    <n-button @click="update">提交</n-button>
                </n-form-item>
            </n-form>
        </n-tab-pane>
       
    </n-tabs>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import RichTextEditor from '../../components/RichTextEditor.vue'

const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")
const adminStore = AdminStore()
// 默认显示界面
const tabValue = ref("list")

// 基本请求体
const addArticle = reactive({
    categoryId: 0,
    title: "",
    content: ""
})
const updateArticle = reactive({
    id:0,
    categoryId: 0,
    title: "",
    content: ""
})

// 获取分类、文章
const categortyOptions = ref([])
const blogListInfo = ref([])
onMounted(()=>{
    loadCategories()
    loadBlogs()
})
// 分页
const pageInfo = reactive({
    page:1,
    pageSize: 5,
    count:0,
    pageCount:0
})



const loadCategories = async () => {
    let res = await axios.get("/category/list")
    // 将返回来的data赋值给分类表，因为是ref()创建的数组，所以是给其value赋值
    categortyOptions.value = res.data.rows.map((item)=>{
        return {
            label: item.name,
            value: item.id
        }
    })
}

const loadBlogs = async (page = 0)=>{
    // 解决naive ui给page默认值导致延迟刷新页码问题
    if(page != 0){
        pageInfo.page = page;
    }
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
    blogListInfo.value = res.data.data.rows
    let temp_rows = res.data.data.rows
    for(let row of temp_rows){
        // 将时间戳还原回标准时间
        let d = new Date(row.create_time)
        row.create_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDay()}日 ${d.getHours()}:${d.getMinutes()}`
    }
    // 计算总页数
    pageInfo.count = res.data.data.count
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize >0 ? 1 : 0)
}

// 添加文章
const add = async () => {
    let res = await axios.post("/blog/_token/add", addArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)
        addArticle.title = ""
        addArticle.content = ""
        addArticle.categoryId = 0
        loadBlogs()
        tabValue.value = "list"
    } else {
        message.error(res.data.msg)
    }
}

// 修改文章
const toUpdate = async(blog)=>{
    tabValue.value = "update"
    let id = blog.id
    let res = await axios.get(`/blog/detail?id=${id}`)
    let resBlog = res.data.rows[0]
    updateArticle.id = blog.id
    updateArticle.categoryId = resBlog.category_id
    updateArticle.title = resBlog.title
    updateArticle.content = resBlog.content
}
const update = async () => {
    let res = await axios.put("/blog/_token/update", updateArticle)
    if (res.data.code == 200) {
        message.info(res.data.msg)
        loadBlogs()
        tabValue.value = "list"
    } else {
        message.error(res.data.msg)
    }
}

// 删除文章
const toDelete = async (blog)=>{
    dialog.warning({
        title: '警告',
        content: '是否要删除',
        positiveText: '确定',
        negativeText: '取消',
        // 点击 "确定" 之后触发的事件
        onPositiveClick: async () => {
            let res = await axios.delete("/blog/_token/delete?id="+blog.id)
            if (res.data.code == 200) {
                message.info(res.data.msg)
                loadBlogs()
            } else {
                message.error(res.data.msg)
            }
        },
        // 点击 "取消" 之后触发的事件
        onNegativeClick: () => { }
    })
}

</script>

<style lang="scss" scoped>

</style>