import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
// import router from './router';
import VueRouter from 'vue-router';
import login from './page/login/login';
import reading from './page/reading/reading';

Vue.prototype.$axios=axios;
Vue.config.productionTip = false
Vue.use(VueRouter)

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
    component:login
  }
]

var router=new VueRouter({
  mode:"history",
  routes,})

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
