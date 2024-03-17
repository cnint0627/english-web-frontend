<template>
  <nav>
    <ul>
      <li :class="{ active: activeRoute === '/home' }"><router-link to="/home">首页</router-link></li>
      <li :class="{ active: activeRoute === '/reading' }"><router-link to="/reading">阅读</router-link></li>
      <li :class="{ active: activeRoute === '/listening' }"><router-link to="/listening">听力</router-link></li>
      <li :class="{ active: activeRoute === '/writing' }"><router-link to="/writing">写作</router-link></li>
      <li style="position:absolute;right: 120px;margin-right: 0" v-if="isLogin" :class="{ active: activeRoute === '/user' }"><router-link to="/user">我的</router-link></li>
      <li style="position:absolute;right: 60px;margin-right: 0" v-if="!isLogin" :class="{ active: activeRoute === '/login' }"><router-link to="/login">登录</router-link></li>
      <a-popconfirm id="login" v-if="isLogin" title="确认登出吗?" ok-text="确认" cancel-text="取消" size="mini" @confirm="handleLogout">登出</a-popconfirm>
      <li :class="{ active: activeRoute === '/admin' }"><router-link to="/admin">管理员</router-link></li>
    </ul>
  </nav>
</template>

<script>
import cookie from "vue-cookie";
import {message} from "ant-design-vue";
import mapState from '@/store'

export default {
  name: "Navigation",
  data() {
    return {
      // 当前选中的路由
      activeRoute: null,
      // 是否登录
      isLogin:false
    };
  },
  methods:{
    handleLogout(){
      console.log("登出")
      cookie.delete("ACCESS-TOKEN")
      this.isLogin=false
      mapState.state.isLogin=false
      message.success("登出成功",1)
      this.$router.push({path:"/login"})
    }
  },
  created() {
    this.activeRoute = this.$route.name;
    this.isLogin=mapState.state.isLogin
    this.$router.afterEach((to) => {
      this.activeRoute = to.name;
      this.isLogin=mapState.state.isLogin
    });
  },
};
</script>

<style>
/* 添加一些样式以美化导航栏 */
nav {
  position: fixed;
  top:0;
  left:0;
  right:0;
  background-color: #f2f2f2;
  padding: 10px;
  z-index: 2;
}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

li {
  display: inline-block;
  margin-right: 10px;
}


a {
  text-decoration: none;
  color: #333;
  padding: 5px;
}

#login{
  display: inline-block;
  position:absolute;
  right: 60px;
  background-color: #0095ff;
  color: white;
  padding: 0 5px;
}

/* 定义选中时的样式 */
.active {
  background-color: lightgreen;
  color: #fff; /* 设置选中时的文字颜色 */
}
</style>
