import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
// naive-ui does not provide an export named 'naive'，故暂时分开写
import naive from 'naive-ui'
import { createDiscreteApi } from 'naive-ui'
import { createPinia } from 'pinia'
import { router } from './common/router'
import axios from 'axios'
import { AdminStore } from './stores/AdminStore'

// 全局配置路径
let pathUrl = "http://localhost:8080"
axios.defaults.baseURL = pathUrl
// 全局引入通知类样式
const { message, notification, dialog } = createDiscreteApi(["message","notification","dialog"])


const app = createApp(App)

// provide 提供一个值，可以被后代组件注入
app.provide("axios",axios)
app.provide("message",message)
app.provide("notification",notification)
app.provide("dialog",dialog)
app.provide("server_url",pathUrl)

app.use(naive)
app.use(createPinia())

// 全局拦截器，需放在 pinia 之后，作用是把用户的token值一律传给后面组件
const adminStore = AdminStore()
axios.interceptors.request.use( (config) =>{
    config.headers.token = adminStore.token
    return config
})

app.use(router)

app.mount('#app')
