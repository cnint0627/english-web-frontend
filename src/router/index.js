
import VueRouter from "vue-router";
import Login from "@/views/Login.vue";
import Reading from "@/views/Reading/ReadingList.vue";
import ReadingDetail from "@/views/Reading/ReadingDetail.vue";
import Listening from "@/views/Listening/ListeningList.vue"
import Home from "@/views/Home.vue";
import {message} from "ant-design-vue";
import Admin from "@/views/Admin/Admin.vue";
import AdminReading from "@/views/Admin/ReadingList.vue"
import AdminListening from "@/views/Admin/ListeningList.vue"
import loginCheck from "@/api/loginCheck";
import ListeningDetail from "@/views/Listening/ListeningDetail.vue";
import Writing from "@/views/Writing/WritingList.vue"
import WritingDetail from "@/views/Writing/WritingDetail.vue";


let routes=[
    {
        path:"/login",
        component:Login,
        name:"/login"
    },
    {
        path:"/reading",
        component:Reading,
        name:"/reading"
    },
    {
        path:"/reading/:id",
        component:ReadingDetail,
        name:"/reading"
    },
    {
        path:"/listening",
        component: Listening,
        name:"/listening"
    },
    {
        path:"/listening/:id",
        component: ListeningDetail,
        name:"/listening"
    },
    {
        path:"/writing",
        component: Writing,
        name:"/writing"
    },
    {
        path:"/writing/:id",
        component: WritingDetail,
        name:"/writing"
    },
    {
        path:"/home",
        component:Home,
        name:"/home"
    },
    {
        path:"/admin",
        component: Admin,
        name:"/admin"
    },
    {
        path:"/admin/reading",
        component: AdminReading,
        name:"/admin"
    },
    {
        path:"/admin/listening",
        component: AdminListening,
        name:"/admin"
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
    console.log("路由拦截器生效")
    // 检验登录态是否生效
    loginCheck()
        .then(res => {
            if (res.code === 200) {
                if(to.name==='/admin'){
                    // 如果跳转的是管理页面，验证权限
                    if(!res.data.isAdmin){
                        message.error("您不是管理员",1)
                        return
                    }
                }else if(to.path==='/login'){
                    next("/home")
                    return
                }
                next()
            } else {
                if(to.path!=='/login') {
                    // 如果跳转的页面不是登录页，进行拦截
                    console.log("当前用户未登录或登录态过期，重定向到登录页")
                    message.error("您还未登录，请先登录！",1)
                    next("/login")
                }else{
                    next()
                }
            }
        })
})

export default router