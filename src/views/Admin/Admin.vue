<template>
  <div>
    <h1>这是管理员页面</h1>
    <a-button @click="handleAddReading">添加阅读文章</a-button>
    <ReadingModal ref="modalForm"></ReadingModal>
  </div>
</template>

<script>
import ReadingModal from "@/views/Admin/ReadingModal.vue";

export default {
  name: "Admin",
  components:{
    ReadingModal
  },
  data() {
    return {

    };
  },
  methods:{
    handleAddReading(){
      this.$refs.modalForm.model= JSON.parse(JSON.stringify(this.$refs.modalForm.modelDefault))
      this.$refs.modalForm.visible=true
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
