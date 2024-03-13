
import VueRouter from "vue-router";
import {getAction} from "@/api/action";
import Login from "@/views/Login.vue";
import Reading from "@/views/Reading/ReadingList.vue";
import ReadingDetail from "@/views/Reading/ReadingDetail.vue";
import home from "@/views/Home.vue";
import {message} from "ant-design-vue";


let routes=[
    {
        path:"/login",
        component:Login,
        meta:"/login"
    },
    {
        path:"/reading",
        component:Reading,
        meta:"/reading"
    },
    {
        path:"/reading/:id",
        component:ReadingDetail,
        meta:"/reading"
    },
    {
        path:"/home",
        component:home,
        meta:"/home"
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
    if(to.path!=="/login") {
        // 检验登录态是否生效
        getAction("/user/getByToken")
            .then(res => {
                if (res.code === 200) {
                    next()
                } else {
                    console.log("当前用户未登录或登录态过期，重定向到登录页")
                    message.error("您还未登录，请先登录！")
                    next("/login")
                }
            })
    }else {
        next()
    }
})

export default router