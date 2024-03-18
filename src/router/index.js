
import VueRouter from "vue-router";
import Login from "@/views/Login.vue";
import Reading from "@/views/Reading/ReadingList.vue";
import ReadingDetail from "@/views/Reading/ReadingDetail.vue";
import Listening from "@/views/Listening/ListeningList.vue"
import Home from "@/views/Home.vue";
import User from "@/views/User/User.vue"
import UserProfile from "@/views/User/Profile.vue"
import {message} from "ant-design-vue";
import Admin from "@/views/Admin/Admin.vue";
import AdminReading from "@/views/Admin/ReadingList.vue"
import AdminListening from "@/views/Admin/ListeningList.vue"
import loginCheck from "@/api/loginCheck";
import ListeningDetail from "@/views/Listening/ListeningDetail.vue";
import Writing from "@/views/Writing/WritingList.vue"
import WritingDetail from "@/views/Writing/WritingDetail.vue";
import mapState from "@/store";


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
        path:"/user",
        component:User,
        name:"/user",
        redirect: "/user/profile",
        children:[
            {
                name:"/user",
                path:"profile",
                component:UserProfile
            }
        ]
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
    if(!mapState.state.isLogin){
        if(to.name==='/login'){
            next()
            return
        }
        console.log("路由拦截器生效")
        next("/login")
        message.error("您还未登录，请先登录",1)
        return
    }
    if(to.name==='/admin') {
        // 如果跳转的是管理页面，验证权限
        loginCheck()
            .then(res => {
                console.log(res.data)
                if (!res.data.isAdmin) {
                    message.error("您不是管理员", 1)
                    next(from)
                }else {
                    next()
                }
            })
    }else if(to.name==='/login'){
        next('/home')
    }else {
        next()
    }
})

export default router