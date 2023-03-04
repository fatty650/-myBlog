<template>
    <div class="main-panel">
        <div class="menus">
            <n-menu
            :options="menuOptions"
            v-model:value="menu"
            @update:value="toPage"
            />
            <!-- <div v-for="(menu, index) in menus" @click="toPage(menu)">
                {{ menu.name }}
            </div> -->
        </div>
        <div style="padding:20px;width:100%">
            <router-view></router-view>
        </div>
    </div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore'
import { ref, reactive, inject, defineComponent, h } from 'vue'
import { NIcon } from "naive-ui";
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()

const message = inject("message")
const axios = inject("axios")

const adminStore = AdminStore()

//左侧栏菜单
const menuOptions = [
    {
        label: "文章管理",
        key: "/dashboard/article",
        href: "/dashboard/article"
    },
    {
        label: "分类管理",
        key: "/dashboard/category",
        href: "/dashboard/category",
    },
    {
        label: "退出登录",
        key: "logout",
        href: "logout",
    }
];

//路由跳转
const menu = ref("文章管理")
const dialog = inject("dialog")
const toPage = () => {
    if (menu.value == 'logout') {
        dialog.warning({
            title: '警告',
            content: '是否要退出登录',
            positiveText: '确定',
            negativeText: '取消',
            // 点击 "确定" 之后触发的事件
            onPositiveClick: async () => {
                router.push("/login")
            },
            // 点击 "取消" 之后触发的事件
            onNegativeClick: () => { }
        })
    } else {
        router.push(menu.value)
    }
}
// 默认显示文章列表
router.push("/dashboard/article")




</script>

<style lang="scss" scoped>
.main-panel {
    display: flex;
    color: #64676a;
    max-width: 1500px;
    margin: 0 auto;
}

.menus {
    padding: 20px 0;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 95vh;
    border-right: 1px solid #dadada;
    div {
        cursor: pointer;
        &:hover {
            color: #fd760e;
        }
    }
}
</style>