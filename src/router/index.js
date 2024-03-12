import login from "@/view/Login.vue";
import reading from "@/view/Reading.vue";
import VueRouter from "vue-router";
import {getAction} from "@/api/action";


let routes=[
    {
        path:"/login",
        component:login
    },
    {
        path:"/reading",
        component:reading
    },
    {
        path:"/*",
        redirect:'/login'
    }
]

const router=new VueRouter({
    mode:"history",
    routes,})

// 路由拦截器，若用户未登录则跳转到登录页面
router.beforeEach( (to,from,next) =>{
    // 如果跳转的页面不是登录页，进行拦截
    if(to.path!="/login") {
        // 检验登录态是否生效
        getAction("reading/list")
            .then(res => {
                if (res.code === 200) {
                    next()
                } else {
                    console.log("当前用户未登录或登录态过期，重定向到登录页")
                    next("/login")
                }
            })
    }else {
        next()
    }
})

export default router