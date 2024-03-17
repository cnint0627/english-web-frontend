import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueRouter from "vue-router"
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import mapState from '@/store'
import store from "@/store";
import LoginCheck from "@/api/loginCheck"


Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Antd)

// 网页挂载前先判断用户登录态
LoginCheck()
    .then(res=>{
        console.log(res)
      if(res.data){
        mapState.state.isLogin=true
      }
      new Vue({
        render: h => h(App),
        router,
        store
      }).$mount('#app')

    })
