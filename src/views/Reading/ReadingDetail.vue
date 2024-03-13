<template>
  <div>
  <h1>{{ record.title }}</h1>
  <h5>{{ record.content }}</h5>
  </div>
</template>

<script>
import {getAction} from "@/api/action";

export default {
  name: "ReadingDetail",
  data() {
    return {
      record:{},
      url:{
        getById:"/reading/getById"
      }
    };
  },
  created() {
    getAction(this.url.getById+"?id="+this.$route.params.id)
        .then(res=>{
          console.log(res)
          if(res.data) {
            this.record = res.data
          }else{
            // 文章不存在
            this.record = {
              title: "该文章不存在"
            }
          }
        })
  },
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
