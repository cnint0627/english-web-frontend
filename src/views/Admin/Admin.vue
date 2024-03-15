<template>
  <div>
    <h1>这是管理员页面</h1>
    <a-button><router-link to="/admin/reading">阅读管理</router-link></a-button>
    <a-button><router-link to="/admin/listening">听力管理</router-link></a-button>
  </div>
</template>

<script>
export default {
  name: "Admin",
  data() {
    return {

    };
  },
  methods:{

  }
};
</script>

<style>
/* 添加一些样式以美化导航栏 */
nav {
  background-color: #f2f2f2;
  padding: 10px;
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
