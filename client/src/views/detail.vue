<template>
    <div class="container">
        <n-layout style="height: 360px">
            <n-layout-header style="height: 64px; padding: 24px" bordered>
            内容详情
            </n-layout-header>
            <n-layout position="absolute" style="top: 64px; bottom: 64px" has-sider>
                <n-card :title='blogInfo.title' >
                    {{ blogInfo.content }}
                    <template #action>
                    发布于 {{ blogInfo.create_time }}
                    </template>
                </n-card>
            </n-layout>
            <n-layout-footer
            position="absolute"
            style="height: 64px; padding: 24px"
            bordered
            >
                <n-button @click="back">返回首页</n-button>
            </n-layout-footer>
        </n-layout>
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const blogInfo = ref({})
const axios = inject("axios")

onMounted(() => {
    loadBlog()
})

/**
 * 读取文章详情
 */
const loadBlog = async () => {
    let res = await axios.get("/blog/detail?id=" + route.query.id)
    blogInfo.value = res.data.rows[0];
    let d = new Date(blogInfo.value.create_time)
    blogInfo.value.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${d.getHours()}:${d.getMinutes()}`
}

const back = ()=>{
    router.push("/")
}

</script>

<style>
.blog-content img {
    max-width: 100% !important;
}
</style>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 0 auto;
}
</style>