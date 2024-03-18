<template>
  <div id="app">
    <Navigation /> <!-- 使用导航栏组件 -->
    <router-view /> <!-- 这里会根据路由显示不同的页面 -->
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";  // 导入导航栏组件


export default {
  name: "App",
  components: {
    Navigation, // 注册导航栏组件
  },
};
</script>

<style>
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  top: 100px;
  left: 0;
  right: 0;
}
</style>
