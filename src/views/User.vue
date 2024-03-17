<template>
  <div>
    <h1>这是网页的User页</h1>
    <h3>您好，{{user.username}}</h3>
    <h3>ID: {{user.id}}</h3>
    <button @click="handleReadingRecord">阅读历史记录</button>
  </div>
</template>

<script>
import loginCheck from "@/api/loginCheck";
import {getAction} from "@/api/action";

export default {
  name: "User",
  data() {
    return {
      user:{

      },
      url:{
        getReadingRecord:"/user/getReadingRecord"
      }
    };
  },
  created() {
    loginCheck()
        .then(res=>{
          this.user=res.data
        })
  },
  methods:{
    handleReadingRecord(){
      getAction(this.url.getReadingRecord)
          .then(res=>{
            console.log(res)
          })
    }
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
