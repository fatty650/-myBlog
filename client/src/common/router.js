import { createRouter, createWebHashHistory } from 'vue-router';

let routes = [
    {path: "/test",component: ()=> import("../views/Test.vue")},
    {path: "/login",component: ()=> import("../views/Login.vue")},
    {path: "/dashboard",component: ()=> import("../views/dashboard/Dashboard.vue"),children:[
        {path: "/dashboard/category", component: ()=> import("../views/dashboard/Category.vue")},
        {path: "/dashboard/article", component: ()=> import("../views/dashboard/Article.vue")},
    ]},
    {path: "/",component: ()=> import("../views/Homepage.vue")},
    {path: "/detail",component: ()=> import("../views/detail.vue")},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

// routes  目前未用到，场景：侧边栏显示多路由
export { router,routes }