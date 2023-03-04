<template>
    <div class="container">
        <div class="nav">
            <div @click="homePage">首页</div>
            <div>
                <n-popselect @update:value="searchByCategory" v-model:value="selectedCategory" :options="categortyOptions" trigger="click">
                    <div><span>{{ categoryName }}</span></div>
                </n-popselect>
            </div>
            <div @click="dashboard">后台</div>
        </div>
        <n-divider />
        <n-space class="search">
            <n-input v-model:value="pageInfo.key" :style="{ width: '500px' }" placeholder="请输入关键字" />
            <n-button type="primary" ghost @click="loadBlogs(0)"> 搜索 </n-button>
        </n-space>

        <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px;cursor: pointer;">
            <n-card :title="blog.title" @click="toDetail(blog)">
                <n-ellipsis style="max-width:500px">
                    {{ blog.content }}
                </n-ellipsis>
                <template #footer>
                    <n-space align="center">
                        <div>发布时间：{{ blog.create_time }}</div>
                    </n-space>
                </template>
            </n-card>
        </div>

        <n-pagination
        @update:page="loadBlogs"
        v-model:page="pageInfo.page"
        v-model:page-size=pageInfo.pageSize
        :page-count="pageInfo.pageCount"
        show-quick-jumper
        >
            <template #goto>跳转至</template>
        </n-pagination>

        <n-divider />
        <div class="footer">
            <div>Power by 黄俊成</div>
            <div>博客 VUE3 项目</div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// 路由
const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

// 选中的分类
const selectedCategory = ref(0)
// 分类选项
const categortyOptions = ref([])
// 文章列表
const blogListInfo = ref([])

// 查询和分页数据
const pageInfo = reactive({
    page: 1,
    pageSize: 5,
    pageCount: 0,
    count: 0,
    key: "",
    categoryId:0,
})

onMounted(() => {
    loadCategorys();
    loadBlogs()
})

/**
 * 获取博客列表
 */
const loadBlogs = async (page = 0) => {
    // 解决naive ui给page默认值导致延迟刷新页码问题
    if (page != 0) {
        pageInfo.page = page;
    }
    let res = await axios.get(`/blog/search?key=${pageInfo.key}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`)
    let temp_rows = res.data.data.rows;
    // 处理获取的文章列表数据
    for (let row of temp_rows) {
        // 把时间戳转换为标准时间
        let d = new Date(row.create_time)
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`
    }
    blogListInfo.value = temp_rows;
    pageInfo.count = res.data.data.count;
    //计算分页大小
    pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize > 0 ? 1 : 0)
    // console.log(res)
}

const categoryName = computed(() => {
    //获取选中的分类
    let selectedOption = categortyOptions.value.find((option) => { return option.value == selectedCategory.value })
    //返回分类的名称
    return selectedOption ? selectedOption.label : "分类"
})

/**
 * 获取分类列表
 */
const loadCategorys = async () => {
    let res = await axios.get("/category/list")
    categortyOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    // console.log(categortyOptions.value)
}

/**
 * 选中分类
 */
const searchByCategory = (categoryId)=>{
    pageInfo.categoryId = categoryId ;
    // 分类刷新后，页面也显示第一页的内容
    pageInfo.page = 1
    loadBlogs()
}

//页面跳转
const toDetail = (blog)=>{
    router.push({path:"/detail",query:{id:blog.id}})
}

const homePage = () => {
    router.push("/")
}

const dashboard = () => {
    router.push("/login")
}


</script>

<style lang="scss" scoped>

.search{
    margin-bottom: 15px;
}
.container {
    width: 1200px;
    margin: 0 auto;
    padding-left: 20px;
}

.nav {
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    color: #64676a;

    div {
        cursor: pointer;
        margin-right: 15px;

        &:hover {
            color: #f60;
        }

        span {
            // font-size: 12px;
        }
    }
}
.content{
}

.footer {
    text-align: center;
    line-height: 25px;
    color: #64676a;
}
</style>