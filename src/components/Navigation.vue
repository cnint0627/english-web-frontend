<template>
  <nav>
    <ul>
      <li :class="{ active: activeRoute === '/home' }"><router-link to="/home">首页</router-link></li>
      <li :class="{ active: activeRoute === '/reading' }"><router-link to="/reading">阅读</router-link></li>
      <li :class="{ active: activeRoute === '/login' }"><router-link to="/login">登录</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      activeRoute: null,
    };
  },
  created() {
    this.activeRoute = this.$route.meta;
    this.$router.afterEach((to) => {
      this.activeRoute = to.meta;
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

/* 定义选中时的样式 */
.active {
  background-color: lightgreen;
  color: #fff; /* 设置选中时的文字颜色 */
}
</style>
