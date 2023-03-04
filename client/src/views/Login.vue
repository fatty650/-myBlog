<template>
    <div class="container">
        <n-card title="管理后台登录">
            <n-form :rules="rules" :model="admin">
                <n-form-item path="account" label="账号">
                    <n-input v-model:value="admin.account" placeholder="请输入账号"/>
                </n-form-item>
                <n-form-item path="password" label="密码">
                    <n-input v-model:value="admin.password" placeholder="请输入密码"/>
                </n-form-item>
            </n-form>
            <template #footer>
                 <n-space align="center">
                    <n-checkbox v-model:checked="admin.rember" label="记住我" />
                    <n-button @click="login">登录</n-button>
                    <n-button @click="back">返回主页</n-button>
                 </n-space>
            </template>
        </n-card>
    </div>
</template>

<script setup>
// inject 注入 axios
import { ref,reactive,inject } from 'vue'
import { AdminStore } from '../stores/AdminStore'
// 引入路由（登录成功后跳转）
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const axios = inject("axios")
// 实例化
const adminStore = AdminStore()
const message = inject("message")
// 验证表单规则
let rules = {
    account: [
        {required: true,message:"请输入账号", trigger: "blur"},
        {min: 3, max: 12, message:"账号长度要在3~12个字符",trigger:"blur"}
    ],
    password: [
        {required: true,message:"请输入密码", trigger: "blur"},
        {min: 6, max: 18, message:"密码长度要在6~18个字符",trigger:"blur"}
    ],
}
// 初始化 admin 管理员登录数据 ，并给与默认值
const admin = reactive({
    account: localStorage.getItem("account") || "",
    password:localStorage.getItem("password") || "",
    rember: localStorage.getItem("rember") == 1 || false //返回bool值
})
// 登录功能实现，根据后端文件AdminRouter编写端口和传入参数
const login = async ()=>{
    let res = await axios.post("/admin/login",{
        account:admin.account,password:admin.password
    })
    let resData  = res.data
    if (resData.code === 200){  //登录成功将状态存储至store
        adminStore.token = resData.data.token
        adminStore.account = resData.data.account
        adminStore.id = resData.data.id
        // "记住我" 功能实现
        if(admin.rember){
            localStorage.setItem("account", admin.account)
            localStorage.setItem("password", admin.password)
            // true 为 1，false 为 0
            localStorage.setItem("rember", admin.rember?1:0)
        }else{
            // 若本次登录 rember 为 false，则清空本地管理员登录数据
            localStorage.setItem("account", "")
            localStorage.setItem("password", "")
            localStorage.setItem("rember", 0)
        }
        // 跳路由
        router.push("/dashboard")
        message.info("Login success!")
    }else{
        // 若登录失败，则直接重置本地管理员登录数据
        localStorage.setItem("account", "")
        localStorage.setItem("password", "")
        localStorage.setItem("rember", 0)
        message.error("Login error!")
    }
}

// 返回主页
const back = ()=>{
    router.push("/")
}

</script>

<style lang="scss" scoped>
.container {
    width: 1200px;
    margin: 20px auto;
}
</style>