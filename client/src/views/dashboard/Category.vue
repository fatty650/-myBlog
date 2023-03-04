<template>
    <div>
        <n-button @click="showAddModel = true">添加</n-button>
        <!-- 表格 -->
        <n-table :bordered="false" :single-line="false">
            <!-- 表头 -->
            <thead>
                <tr>
                    <th>分类编号</th>
                    <th>分类名称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <!-- 表体 -->
            <tbody>
                <!-- 遍历分类表 -->
                <tr v-for="(category, index) in categoryList">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <n-space>
                            <n-button @click="toUpdate(category)">修改分类名称</n-button>
                            <n-button @click="deleteCategory(category)">删除该分类</n-button>
                        </n-space>
                    </td>
                </tr>
            </tbody>
        </n-table>
        <!-- 添加分类提示框  -->
        <n-modal v-model:show="showAddModel" preset="dialog" title="Dialog">
            <!-- 头部标题 -->
            <template #header>
                <div>添加分类</div>
            </template>
            <div>
                <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <!-- 操作部分 -->
            <template #action>
                <div>
                    <n-button @click="add">提交</n-button>
                </div>
            </template>
        </n-modal>
        <!-- 修改分类提示框 -->
        <n-modal v-model:show="showUpdateModel" preset="dialog" title="Dialog">
            <template #header>
                <div>修改分类</div>
            </template>
            <div>
                <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="update">提交</n-button>
                </div>
            </template>
        </n-modal>
    </div>
</template>

<script setup>

import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const message = inject("message")
const dialog = inject("dialog")
const axios = inject("axios")

const adminStore = AdminStore()

// ref 设定为false，默认隐藏两个弹出框
const showAddModel = ref(false)
const showUpdateModel = ref(false)

// 创建分类表，使用ref语法糖创建数组，为了触发响应式的更新
const categoryList = ref([])
const addCategory = reactive({
    name: ""
})

const updateCategory = reactive({
    id:0,
    name: ""
})
// 生命周期钩子，数据加载时
onMounted(() => {
    loadDatas()
})
// axios 与后台交互数据 get方法 端口号为/category/list
const loadDatas = async () => {
    let res = await axios.get("/category/list")
    // 将返回来的data赋值给分类表，因为是ref()创建的数组，所以是给其value赋值
    categoryList.value = res.data.rows
}
// 添加分类方法
const add = async () => {
    let res = await axios.post("/category/_token/add", { name: addCategory.name })
    if (res.data.code == 200) { // 成功添加
        // 自动更新并通知
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    // 隐藏 “添加弹出框”
    showAddModel.value = false;
}
// 修改分类方法
const toUpdate = async (category) =>{
    showUpdateModel.value = true 
    updateCategory.id = category.id
    updateCategory.name = category.name
}

const update = async ()=>{
    let res = await axios.put("/category/_token/update", { id:updateCategory.id, name: updateCategory.name })
    if (res.data.code == 200) {
        loadDatas()
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showUpdateModel.value = false;
}

const deleteCategory = async (category) => {
    // 弹出框警告
    dialog.warning({
        title: '警告',
        content: '是否要删除',
        positiveText: '确定',
        negativeText: '取消',
        // 点击 "确定" 之后触发的事件
        onPositiveClick: async () => {
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`)
            if (res.data.code == 200) {
                loadDatas()  // 自动刷新
                message.info(res.data.msg)
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